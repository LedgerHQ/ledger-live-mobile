import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { useValidators } from "@ledgerhq/live-common/lib/families/solana/react";
import { ValidatorsAppValidator } from "@ledgerhq/live-common/lib/families/solana/validator-app";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { useTheme } from "@react-navigation/native";
import invariant from "invariant";
import React, { useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FlatList, Linking, StyleSheet, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { TrackScreen } from "../../../analytics";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import ExternalLink from "../../../components/ExternalLink";
import InfoModal from "../../../components/InfoModal";
import { Text } from "@ledgerhq/native-ui";
import Touchable from "../../../components/Touchable";
import { ScreenName } from "../../../const";
import Info from "../../../icons/Info";
import { accountScreenSelector } from "../../../reducers/accounts";
import ValidatorImage from "../shared/ValidatorImage";

type Props = {
  account: AccountLike,
  parentAccount?: Account,
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  validator?: ValidatorsAppValidator,
};

export default function SelectValidator({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const [showInfos, setShowInfos] = useState(false);

  invariant(account, "account must be defined");
  invariant(account.type === 'Account', 'account must be of type Account')

  const validators = useValidators(account.currency);

  const displayInfos = useCallback(() => {
    setShowInfos(true);
  }, []);

  const hideInfos = useCallback(() => {
    setShowInfos(false);
  }, []);

  const onItemPress = useCallback(
    (validator: ValidatorsAppValidator) => {
      navigation.navigate(ScreenName.DelegationSummary, {
        ...route.params,
        validator,
      });
    },
    [navigation, route.params],
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
      forceInset={{bottom: 'always'}}
    >
      <TrackScreen category="DelegationFlow" name="SelectValidator" />
      <View style={styles.header}>
        <ValidatorHead onPressHelp={displayInfos} />
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
          <Text fontWeight="semiBold" style={styles.providedByText} color="grey">
            <Trans i18nKey="delegation.yieldInfos" />
          </Text>
          <ExternalLink
            text={<Text fontWeight="bold">Baking Bad</Text>}
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
  validatorHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  validatorHeadText: {
    fontSize: 14,
  },
  validatorHeadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  validatorHeadInfo: {
    marginLeft: 5,
  },
  validator: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
  },
  validatorBody: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
  },
  validatorName: {
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
  validatorYield: {
    fontSize: 14,
  },
  validatorYieldFull: {
    opacity: 0.5,
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
      style={[{ backgroundColor: colors.lightFog }]}
    >
      <Text fontWeight="semiBold" numberOfLines={1}>
        <CurrencyUnitValue showCode unit={unit} value={account.balance} />
      </Text>
    </View>
  );
};

const keyExtractor = (v: ValidatorsAppValidator) => v.voteAccount;

const ValidatorHead = ({ onPressHelp }: { onPressHelp: () => void }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.validatorHead}>
      <Text
        style={styles.validatorHeadText}
        color="smoke"
        numberOfLines={1}
        fontWeight='semiBold'
      >
        Validator
      </Text>
      <View style={styles.validatorHeadContainer}>
        <Text
          style={styles.validatorHeadText}
          color="smoke"
          numberOfLines={1}
          fontWeight='semiBold'
        >
          Total Stake
        </Text>
        <Touchable
          style={styles.validatorHeadInfo}
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
  const onPressT = useCallback(() => {
    onPress(validator);
  }, [validator, onPress]);

  return (
    <Touchable
      event="DelegationFlowChosevalidator"
      eventProperties={{
        validatorName: validator.name || validator.voteAccount,
      }}
      onPress={onPressT}
    >
      <View style={styles.validator}>
        <ValidatorImage size={32} imgUrl={validator.avatarUrl} name={validator.name ?? validator.voteAccount} />
        <View style={styles.validatorBody}>
          <Text numberOfLines={1} fontWeight='semiBold' style={styles.validatorName}>
            {validator.name || validator.voteAccount}
          </Text>
          {true ? (
            <Text
              fontWeight="semiBold"
              numberOfLines={1}
              style={styles.overdelegated}
            >
              commission {validator.commission} %
            </Text>
          ) : null}
        </View>
        <Text
          fontWeight="semiBold"
          numberOfLines={1}
          style={[styles.validatorYield]}
          color="smoke"
        >
          <Text fontWeight="semiBold" numberOfLines={1}>
            <CurrencyUnitValue
              showCode
              unit={getAccountUnit(account)}
              value={validator.activeStake}
            />
          </Text>
        </Text>
      </View>
    </Touchable>
  );
};
