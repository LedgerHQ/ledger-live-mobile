/* @flow */

import { RecipientRequired } from "@ledgerhq/errors";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import { useLedgerFirstShuffledValidators } from "@ledgerhq/live-common/lib/families/solana/react";
import { ValidatorsAppValidator } from "@ledgerhq/live-common/lib/families/solana/validator-app";
import type { Baker } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import { useBakers } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import whitelist from "@ledgerhq/live-common/lib/families/tezos/bakers.whitelist-default";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import { useTheme } from "@react-navigation/native";
import invariant from "invariant";
import React, { useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FlatList, Linking, StyleSheet, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import Icon from "react-native-vector-icons/dist/Feather";
import { useSelector } from "react-redux";
import { TrackScreen } from "../../../analytics";
import ExternalLink from "../../../components/ExternalLink";
import InfoModal from "../../../components/InfoModal";
import LText, { getFontStyle } from "../../../components/LText";
import Touchable from "../../../components/Touchable";
import { ScreenName } from "../../../const";
import Info from "../../../icons/Info";
import { accountScreenSelector } from "../../../reducers/accounts";
import ValidatorImage from "../shared/ValidatorImage";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";

const forceInset = { bottom: "always" };

const keyExtractor = (v: ValidatorsAppValidator) => v.voteAccount;

const BakerHead = ({ onPressHelp }: { onPressHelp: () => void }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.bakerHead}>
      <LText
        style={styles.bakerHeadText}
        color="smoke"
        numberOfLines={1}
        semiBold
      >
        Validator
      </LText>
      <View style={styles.bakerHeadContainer}>
        <LText
          style={styles.bakerHeadText}
          color="smoke"
          numberOfLines={1}
          semiBold
        >
          Total Stake
        </LText>
        <Touchable
          style={styles.bakerHeadInfo}
          event="StepValidatorShowProvidedBy"
          onPress={onPressHelp}
        >
          <Info color={colors.smoke} size={14} />
        </Touchable>
      </View>
    </View>
  );
};
const ValidatorRow = ({
  onPress,
  validator,
  account,
}: {
  onPress: (v: ValidatorsAppValidator) => void,
  validator: ValidatorsAppValidator,
  account: AccountLike,
}) => {
  const { colors } = useTheme();
  /*
  const onPressT = useCallback(() => {
    onPress(baker);
  }, [baker, onPress]);
  */

  return (
    <Touchable
      event="DelegationFlowChoseBaker"
      eventProperties={{ validator }}
      onPress={onPress}
    >
      <View style={styles.baker}>
        <ValidatorImage size={32} validator={validator} />
        <View style={styles.bakerBody}>
          <LText numberOfLines={1} semiBold style={styles.bakerName}>
            {validator.name || validator.voteAccount}
          </LText>
          {true ? (
            <LText
              semiBold
              numberOfLines={1}
              style={styles.overdelegated}
              //color="orange"
            >
              commission {validator.commission} %
            </LText>
          ) : null}
        </View>
        <LText
          semiBold
          numberOfLines={1}
          style={[styles.bakerYield]}
          color="smoke"
        >
          <LText semiBold numberOfLines={1}>
            <CurrencyUnitValue
              showCode
              unit={getAccountUnit(account)}
              value={validator.activeStake}
            />
          </LText>
        </LText>
      </View>
    </Touchable>
  );
};

const ModalIcon = () => {
  const { colors } = useTheme();
  return <Icon name="user-plus" size={24} color={colors.live} />;
};

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  transaction: Transaction,
  status: TransactionStatus,
};

export default function SelectValidator({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const bakers = useBakers(whitelist);
  const [editingCustom, setEditingCustom] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showInfos, setShowInfos] = useState(false);

  invariant(account, "account must be defined");

  const validators = useLedgerFirstShuffledValidators(account.currency);

  const {
    transaction,
    setTransaction,
    status,
    bridgePending,
    bridgeError,
  } = useBridgeTransaction(() => {
    const bridge = getAccountBridge(account, parentAccount);
    return {
      account,
      parentAccount,
      transaction: route.params.transaction,
    };
  });

  invariant(transaction, "transaction is undefined");

  let error = bridgeError || status.errors.recipient;

  if (error instanceof RecipientRequired) {
    error = null;
  }

  const continueCustom = useCallback(() => {
    setEditingCustom(false);
    navigation.navigate(ScreenName.DelegationSummary, {
      ...route.params,
      transaction,
    });
  }, [navigation, transaction, route.params]);

  const displayInfos = useCallback(() => {
    setShowInfos(true);
  }, []);

  const hideInfos = useCallback(() => {
    setShowInfos(false);
  }, []);

  const onItemPress = useCallback(
    (baker: Baker) => {
      const bridge = getAccountBridge(account, parentAccount);
      const transaction = bridge.updateTransaction(route.params?.transaction, {
        recipient: baker.address,
      });
      navigation.navigate(ScreenName.DelegationSummary, {
        ...route.params,
        transaction,
      });
    },
    [navigation, account, parentAccount, route.params],
  );

  const renderItem = useCallback(
    ({ item }: { item: ValidatorsAppValidator }) => (
      <ValidatorRow account={account} validator={item} onPress={onItemPress} />
    ),
    [onItemPress],
  );

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      forceInset={forceInset}
    >
      <TrackScreen category="DelegationFlow" name="SelectValidator" />
      <View style={styles.header}>
        {/* TODO SEARCH */}
        <BakerHead onPressHelp={displayInfos} />
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={validators}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />

      <InfoModal
        id="SelectValidatorInfos"
        isOpened={showInfos}
        onClose={hideInfos}
        confirmLabel={t("common.close")}
      >
        <View style={styles.providedByContainer}>
          <LText semiBold style={styles.providedByText} color="grey">
            <Trans i18nKey="delegation.yieldInfos" />
          </LText>
          <ExternalLink
            text={<LText bold>Baking Bad</LText>}
            event="SelectValidatorOpen"
            onPress={() => Linking.openURL("https://baking-bad.org/")}
          />
        </View>
      </InfoModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  footer: {
    padding: 16,
  },
  center: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  bakerHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bakerHeadText: {
    fontSize: 14,
  },
  bakerHeadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bakerHeadInfo: {
    marginLeft: 5,
  },
  baker: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
  },
  bakerBody: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
  },
  bakerName: {
    fontSize: 14,
  },
  overdelegatedIndicator: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 10,
    top: 34,
    left: 24,
    borderWidth: 1,
  },
  overdelegated: {
    fontSize: 12,
  },
  bakerYield: {
    fontSize: 14,
  },
  bakerYieldFull: {
    opacity: 0.5,
  },
  addressInput: {
    ...getFontStyle({ semiBold: true }),
    fontSize: 20,
    paddingVertical: 16,
  },
  warningBox: {
    alignSelf: "stretch",
    marginTop: 8,
  },
  providedByContainer: {
    display: "flex",
    flexDirection: "row",
  },
  providedByText: {
    fontSize: 14,
    marginRight: 5,
  },
  infoModalContainerStyle: {
    alignSelf: "stretch",
  },
});

const Amount = ({
  account,
  value,
}: {
  account: AccountLike,
  value: number,
}) => {
  const unit = getAccountUnit(account);
  const { colors } = useTheme();
  return (
    <View
      style={[styles.accountBalanceTag, { backgroundColor: colors.lightFog }]}
    >
      <LText semiBold numberOfLines={1}>
        <CurrencyUnitValue showCode unit={unit} value={account.balance} />
      </LText>
    </View>
  );
};
