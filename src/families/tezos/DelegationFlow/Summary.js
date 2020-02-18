/* @flow */
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
// $FlowFixMe
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import type { NavigationScreenProp } from "react-navigation";
import invariant from "invariant";
import Icon from "react-native-vector-icons/dist/Feather";
import i18next from "i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import {
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
  shortAddressPreview,
} from "@ledgerhq/live-common/lib/account";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import {
  useDelegation,
  useBaker,
  useBakers,
  useRandomBaker,
} from "@ledgerhq/live-common/lib/families/tezos/bakers";
import whitelist from "@ledgerhq/live-common/lib/families/tezos/bakers.whitelist-default";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { accountAndParentScreenSelector } from "../../../reducers/accounts";
import colors, { rgba } from "../../../colors";
import { TrackScreen } from "../../../analytics";
import { useTransactionChangeFromNavigation } from "../../../logic/screenTransactionHooks";
import Button from "../../../components/Button";
import LText from "../../../components/LText";
import Circle from "../../../components/Circle";
import CurrencyIcon from "../../../components/CurrencyIcon";
import StepHeader from "../../../components/StepHeader";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import Touchable from "../../../components/Touchable";
import VerifyAddressDisclaimer from "../../../components/VerifyAddressDisclaimer";
import DelegatingContainer from "../DelegatingContainer";
import BakerImage from "../BakerImage";

const forceInset = { bottom: "always" };

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  navigation: NavigationScreenProp<{
    params: {
      mode?: "delegate" | "undelegate",
      accountId: string,
      parentId?: string,
    },
  }>,
};

const AccountBalanceTag = ({ account }: { account: AccountLike }) => {
  const unit = getAccountUnit(account);
  return (
    <View style={styles.accountBalanceTag}>
      <LText tertiary numberOfLines={1} style={styles.accountBalanceTagText}>
        <CurrencyUnitValue showCode unit={unit} value={account.balance} />
      </LText>
    </View>
  );
};

const ChangeDelegator = () => (
  <Circle style={styles.changeDelegator} bg={colors.live} size={26}>
    <Icon size={13} name="edit-2" color={colors.white} />
  </Circle>
);

const Line = ({ children }: { children: React$Node }) => (
  <View style={styles.summaryLine}>{children}</View>
);

const Words = ({
  children,
  highlighted,
  style,
}: {
  children: React$Node,
  highlighted?: boolean,
  style?: *,
}) => (
  <LText
    numberOfLines={1}
    semiBold={!highlighted}
    bold={highlighted}
    style={[
      styles.summaryWords,
      highlighted ? styles.summaryWordsHighlighted : null,
      style,
    ]}
  >
    {children}
  </LText>
);

const BakerSelection = ({
  name,
  readOnly,
}: {
  name: string,
  readOnly?: boolean,
}) => (
  <View style={styles.bakerSelection}>
    <LText bold numberOfLines={1} style={styles.bakerSelectionText}>
      {name}
    </LText>
    {readOnly ? null : (
      <View style={styles.bakerSelectionIcon}>
        <Icon size={16} name="edit-2" color={colors.white} />
      </View>
    )}
  </View>
);

const DelegationSummary = ({ account, parentAccount, navigation }: Props) => {
  const bakers = useBakers(whitelist);
  const randomBaker = useRandomBaker(bakers);

  const {
    transaction,
    setTransaction,
    status,
    bridgePending,
    bridgeError,
  } = useBridgeTransaction(() => ({
    account,
    parentAccount,
  }));

  invariant(transaction, "transaction must be defined");
  invariant(transaction.family === "tezos", "transaction tezos");

  // make sure tx is in sync
  useEffect(() => {
    if (!transaction || !account) return;
    invariant(transaction.family === "tezos", "tezos tx");

    // make sure the mode is in sync (an account changes can reset it)
    const patch: Object = {
      mode: navigation.getParam("mode") || "delegate",
    };

    // make sure that in delegate mode, a transaction recipient is set (random pick)
    if (patch.mode === "delegate" && !transaction.recipient && randomBaker) {
      patch.recipient = randomBaker.address;
    }

    // when changes, we set again
    if (patch.mode !== transaction.mode || "recipient" in patch) {
      setTransaction(
        getAccountBridge(account, parentAccount).updateTransaction(
          transaction,
          patch,
        ),
      );
    }
  }, [
    account,
    randomBaker,
    navigation,
    parentAccount,
    setTransaction,
    transaction,
  ]);

  const [rotateAnim] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ]),
    ).start();
    return () => {
      rotateAnim.setValue(0);
    };
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "30deg"],
  });

  const onChangeDelegator = useCallback(() => {
    rotateAnim.setValue(0);
    navigation.navigate("DelegationSelectValidator", {
      ...navigation.state.params,
      transaction,
    });
  }, [rotateAnim, navigation, transaction]);

  const delegation = useDelegation(account);
  const addr =
    transaction.mode === "undelegate"
      ? (delegation && delegation.address) || ""
      : transaction.recipient;
  const baker = useBaker(addr);
  const bakerName = baker ? baker.name : shortAddressPreview(addr);
  const currency = getAccountCurrency(account);
  const color = getCurrencyColor(currency);
  const accountName = getAccountName(account);

  // handle any edit screen changes
  useTransactionChangeFromNavigation({
    navigation,
    setTransaction,
  });

  const onContinue = useCallback(async () => {
    navigation.navigate("DelegationConnectDevice", {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      transaction,
      status,
    });
  }, [status, account, parentAccount, navigation, transaction]);

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="DelegationFlow" name="Summary" />

      <View style={styles.body}>
        <DelegatingContainer
          undelegation={transaction.mode === "undelegate"}
          left={
            <View style={styles.delegatingAccount}>
              <Circle size={64} bg={rgba(color, 0.2)}>
                <CurrencyIcon size={32} currency={currency} />
              </Circle>
              <AccountBalanceTag account={account} />
            </View>
          }
          right={
            transaction.mode === "delegate" ? (
              <Touchable
                event="DelegationFlowSummaryChangeCircleBtn"
                onPress={onChangeDelegator}
              >
                <Circle size={70} style={styles.bakerCircle}>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate,
                        },
                      ],
                    }}
                  >
                    <BakerImage baker={baker} />
                  </Animated.View>
                  <ChangeDelegator />
                </Circle>
              </Touchable>
            ) : (
              <BakerImage baker={baker} />
            )
          }
        />

        <View style={styles.summary}>
          <Line>
            <Words>
              {transaction.mode === "delegate" ? (
                <Trans i18nKey="delegation.iDelegateMy" />
              ) : (
                <Trans i18nKey="delegation.undelegateMy" />
              )}
            </Words>
            <Words highlighted style={styles.accountName}>
              {accountName}
            </Words>
          </Line>

          {transaction.mode === "delegate" ? (
            <Line>
              <Words>
                <Trans i18nKey="delegation.to" />
              </Words>
              <Touchable
                event="DelegationFlowSummaryChangeBtn"
                onPress={onChangeDelegator}
              >
                <BakerSelection name={bakerName} />
              </Touchable>
            </Line>
          ) : (
            <Line>
              <Words>
                <Trans i18nKey="delegation.from" />
              </Words>
              <BakerSelection readOnly name={bakerName} />
            </Line>
          )}

          {baker && transaction.mode === "delegate" ? (
            baker.capacityStatus === "full" ? null : (
              /*
              <Line>
                <IconInfo size={16} color={colors.orange} />
                <Words style={{ marginLeft: 8, color: colors.orange }}>
                  <Trans i18nKey="delegation.overdelegated" />
                </Words>
              </Line>
              */ <Line>
                <Words>
                  <Trans i18nKey="delegation.forAnEstYield" />
                </Words>
                <Words highlighted>
                  <Trans
                    i18nKey="delegation.yieldPerYear"
                    values={{
                      yield: baker.nominalYield,
                    }}
                  />
                </Words>
              </Line>
            )
          ) : null}
        </View>
        {transaction.mode === "undelegate" ? (
          <VerifyAddressDisclaimer
            text={<Trans i18nKey="delegation.warnUndelegation" />}
          />
        ) : (
          <VerifyAddressDisclaimer
            text={<Trans i18nKey="delegation.warnDelegation" />}
          />
        )}
      </View>
      <View style={styles.footer}>
        <Button
          event="SummaryContinue"
          type="primary"
          title={<Trans i18nKey="common.continue" />}
          containerStyle={styles.continueButton}
          onPress={onContinue}
          disabled={bridgePending || !!bridgeError}
        />
      </View>
    </SafeAreaView>
  );
};

DelegationSummary.navigationOptions = {
  headerLeft: null,
  gesturesEnabled: false,
  headerTitle: (
    <StepHeader
      title={i18next.t("delegation.summaryTitle")}
      subtitle={i18next.t("send.stepperHeader.stepRange", {
        currentStep: "1",
        totalSteps: "3",
      })}
    />
  ),
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: "column",
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "space-around",
  },
  bakerCircle: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderStyle: "dashed",
  },
  changeDelegator: {
    position: "absolute",
    right: -4,
    top: -4,
  },
  delegatingAccount: {
    paddingTop: 26,
  },
  accountBalanceTag: {
    marginTop: 8,
    backgroundColor: colors.lightFog,
    borderRadius: 4,
    padding: 4,
    alignItems: "center",
  },
  accountBalanceTagText: {
    fontSize: 11,
    color: colors.smoke,
  },
  accountName: {
    maxWidth: 180,
  },
  summary: {
    alignItems: "center",
    marginVertical: 30,
  },
  summaryLine: {
    marginVertical: 10,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  summaryWords: {
    marginRight: 6,
    fontSize: 18,
    color: colors.smoke,
  },
  summaryWordsHighlighted: {
    color: colors.live,
  },
  bakerSelection: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: rgba(colors.live, 0.2),
    height: 40,
  },
  bakerSelectionText: {
    paddingHorizontal: 8,
    fontSize: 18,
    color: colors.live,
    maxWidth: 240,
  },
  bakerSelectionIcon: {
    backgroundColor: colors.live,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 40,
  },
  footer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  continueButton: {
    alignSelf: "stretch",
    marginTop: 12,
  },
  termsAndPrivacy: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
  },
  error: {
    color: colors.alert,
    fontSize: 12,
    marginBottom: 5,
  },
  verticalConnector: {
    position: "absolute",
    borderLeftWidth: 2,
    borderColor: colors.lightFog,
    height: 20,
    top: 60,
    left: 16,
  },
});

export default connect(accountAndParentScreenSelector)(
  withTranslation()(DelegationSummary),
);
