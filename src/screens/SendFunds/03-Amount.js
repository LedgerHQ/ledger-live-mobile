/* @flow */
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import React, { useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Switch,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { compose } from "redux";
import { translate, Trans } from "react-i18next";
import i18next from "i18next";
import type { NavigationScreenProp } from "react-navigation";
import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { accountAndParentScreenSelector } from "../../reducers/accounts";
import colors from "../../colors";
import { TrackScreen } from "../../analytics";
import LText from "../../components/LText";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import Button from "../../components/Button";
import StepHeader from "../../components/StepHeader";
import KeyboardView from "../../components/KeyboardView";
import RetryButton from "../../components/RetryButton";
import CancelButton from "../../components/CancelButton";
import GenericErrorBottomModal from "../../components/GenericErrorBottomModal";
import AmountInput from "./AmountInput";

const forceInset = { bottom: "always" };

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  navigation: NavigationScreenProp<{
    params: {
      accountId: string,
      transaction: *,
    },
  }>,
};

const SendAmount = ({ account, parentAccount, navigation }: Props) => {
  const {
    transaction,
    setAccount,
    setTransaction,
    status,
    bridgePending,
    bridgeError,
  } = useBridgeTransaction();

  useMemo(() => {
    setAccount(account, parentAccount);
    setTransaction(navigation.getParam("transaction"));
  }, [setAccount, setTransaction, account, parentAccount, navigation]);

  const onChange = useCallback(
    amount => {
      if (!amount.isNaN()) {
        const bridge = getAccountBridge(account, parentAccount);
        setTransaction(bridge.updateTransaction(transaction, { amount }));
      }
    },
    [setTransaction, account, parentAccount, transaction],
  );

  const toggleUseAllAmount = useCallback(() => {
    const bridge = getAccountBridge(account, parentAccount);
    if (!transaction) return;

    setTransaction(
      bridge.updateTransaction(transaction, {
        useAllAmount: !transaction.useAllAmount,
      }),
    );
  }, [setTransaction, account, parentAccount, transaction]);

  const onContinue = useCallback(() => {
    navigation.navigate("SendSummary", {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      transaction,
    });
  }, [account, parentAccount, navigation, transaction]);

  const onNetworkInfoCancel = useCallback(() => {
    const parent = navigation.dangerouslyGetParent();
    if (parent) parent.goBack();
  }, [navigation]);

  const onNetworkInfoRetry = useCallback(() => {
    if (!transaction) return;
    setTransaction(transaction); // ¯\_(ツ)_/¯
  }, [setTransaction, transaction]);

  const blur = useCallback(() => Keyboard.dismiss(), []);

  if (!account || !transaction) return null;

  const { useAllAmount } = transaction;
  const { amount } = status;
  const unit = getAccountUnit(account);
  const {
    errors: { amount: amountError },
    warnings: { amount: amountWarning },
  } = status;

  // console.log({ transaction, status, bridgePending, bridgeError });

  return (
    <>
      <TrackScreen category="SendFunds" name="Amount" />
      <SafeAreaView style={styles.root} forceInset={forceInset}>
        <KeyboardView style={styles.container}>
          <TouchableWithoutFeedback onPress={blur}>
            <View style={{ flex: 1 }}>
              <AmountInput
                editable={!useAllAmount}
                account={account}
                onChange={onChange}
                currency={unit.code}
                value={amount}
                error={amountError}
              />

              <View style={styles.bottomWrapper}>
                <View style={styles.available}>
                  <View style={styles.availableLeft}>
                    <LText>
                      <Trans i18nKey="send.amount.available" />
                    </LText>
                    <LText tertiary style={styles.availableAmount}>
                      <CurrencyUnitValue
                        showCode
                        unit={unit}
                        value={account.balance}
                      />
                    </LText>
                  </View>
                  {typeof useAllAmount === "boolean" ? (
                    <View style={styles.availableRight}>
                      <LText style={styles.maxLabel}>
                        <Trans i18nKey="send.amount.useMax" />
                      </LText>
                      <Switch
                        style={{ opacity: 0.99 }}
                        value={useAllAmount}
                        onValueChange={toggleUseAllAmount}
                      />
                    </View>
                  ) : null}
                </View>
                <View style={styles.continueWrapper}>
                  <Button
                    event="SendAmountContinue"
                    type="primary"
                    title={
                      <Trans
                        i18nKey={
                          !bridgePending
                            ? "common.continue"
                            : "send.amount.loadingNetwork"
                        }
                      />
                    }
                    onPress={onContinue}
                    disabled={
                      !!amountError ||
                      !!amountWarning ||
                      bridgePending ||
                      amount.isZero()
                    }
                    pending={bridgePending}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardView>
      </SafeAreaView>

      <GenericErrorBottomModal
        error={bridgeError}
        onClose={onNetworkInfoRetry}
        footerButtons={
          <>
            <CancelButton
              containerStyle={styles.button}
              onPress={onNetworkInfoCancel}
            />
            <RetryButton
              containerStyle={[styles.button, styles.buttonRight]}
              onPress={onNetworkInfoRetry}
            />
          </>
        }
      />
    </>
  );
};

SendAmount.navigationOptions = {
  headerTitle: (
    <StepHeader
      title={i18next.t("send.stepperHeader.selectAmount")}
      subtitle={i18next.t("send.stepperHeader.stepRange", {
        currentStep: "3",
        totalSteps: "6",
      })}
    />
  ),
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  available: {
    flexDirection: "row",
    display: "flex",
    flexGrow: 1,
    fontSize: 16,
    color: colors.grey,
    marginBottom: 16,
  },
  availableAmount: {
    color: colors.darkBlue,
  },
  availableRight: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  availableLeft: {
    justifyContent: "center",
    flexGrow: 1,
  },
  maxLabel: {
    marginRight: 4,
  },
  bottomWrapper: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  continueWrapper: {
    alignSelf: "stretch",
    alignItems: "stretch",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonRight: {
    marginLeft: 8,
  },
});

export default compose(
  translate(),
  connect(accountAndParentScreenSelector),
)(SendAmount);
