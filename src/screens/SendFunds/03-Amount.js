/* @flow */
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { compose } from "redux";
import { BigNumber } from "bignumber.js";
import { translate, Trans } from "react-i18next";
import i18next from "i18next";
import type { NavigationScreenProp } from "react-navigation";
import type { TokenAccount, Account } from "@ledgerhq/live-common/lib/types";
import {
  getMainAccount,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getFeesForTransaction } from "@ledgerhq/live-common/lib/libcore/getFeesForTransaction";
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

type Props = {
  account: ?(Account | TokenAccount),
  parentAccount: ?Account,
  navigation: NavigationScreenProp<{
    params: {
      accountId: string,
      transaction: *,
    },
  }>,
};

type State = {
  transaction: *,
  syncNetworkInfoError: ?Error,
  syncTotalSpentError: ?Error,
  syncValidTransactionError: ?Error,
  syncEnoughGasError: ?Error,
  txValidationWarning: ?Error,
  totalSpent: ?BigNumber,
  leaving: boolean,
  maxAmount: ?BigNumber,
};

const similarError = (a, b) =>
  a === b || (a && b && a.name === b.name && a.message === b.message);

class SendAmount extends Component<Props, State> {
  static navigationOptions = {
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

  constructor({ navigation }) {
    super();
    const transaction = navigation.getParam("transaction");
    this.state = {
      transaction,
      syncNetworkInfoError: null,
      syncTotalSpentError: null,
      syncValidTransactionError: null,
      syncEnoughGasError: null,
      txValidationWarning: null,
      totalSpent: null,
      leaving: false,
      maxAmount: null,
    };
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate() {
    this.validate();
  }

  componentWillUnmount() {
    this.nonceTotalSpent++;
    this.nonceValidTransaction++;
    this.networkInfoPending = false;
  }

  networkInfoPending = false;
  syncNetworkInfo = async () => {
    if (this.networkInfoPending) return;
    const { account, parentAccount } = this.props;
    if (!account) return;
    const mainAccount = getMainAccount(account, parentAccount);
    const bridge = getAccountBridge(account, parentAccount);
    if (
      !bridge.getTransactionNetworkInfo(mainAccount, this.state.transaction) &&
      !this.state.syncNetworkInfoError
    ) {
      try {
        this.networkInfoPending = true;
        const networkInfo = await bridge.fetchTransactionNetworkInfo(
          mainAccount,
        );
        if (!this.networkInfoPending) return;
        this.setState(({ transaction }, { account, parentAccount }) =>
          !account
            ? null
            : {
                syncNetworkInfoError: null,
                transaction: getAccountBridge(
                  account,
                  parentAccount,
                ).applyTransactionNetworkInfo(
                  getMainAccount(account, parentAccount),
                  transaction,
                  networkInfo,
                ),
              },
        );
      } catch (syncNetworkInfoError) {
        if (!this.networkInfoPending) return;
        this.setState(old => {
          if (similarError(old.syncNetworkInfoError, syncNetworkInfoError))
            return null;
          return { syncNetworkInfoError };
        });
      } finally {
        this.networkInfoPending = false;
      }
    }
  };

  nonceTotalSpent = 0;
  syncTotalSpent = async () => {
    const { account, parentAccount } = this.props;
    if (!account) return;
    const mainAccount = getMainAccount(account, parentAccount);
    const { transaction } = this.state;
    const bridge = getAccountBridge(account, parentAccount);
    const nonce = ++this.nonceTotalSpent;
    try {
      const totalSpent = await bridge.getTotalSpent(mainAccount, transaction);
      if (nonce !== this.nonceTotalSpent) return;

      this.setState(old => {
        if (
          !old.syncTotalSpentError &&
          old.totalSpent &&
          totalSpent &&
          totalSpent.eq(old.totalSpent)
        ) {
          return null;
        }
        return { totalSpent, syncTotalSpentError: null };
      });
    } catch (syncTotalSpentError) {
      if (nonce !== this.nonceTotalSpent) return;
      this.setState(old => {
        if (similarError(old.syncTotalSpentError, syncTotalSpentError))
          return null;
        return { syncTotalSpentError };
      });
    }
  };

  nonceValidTransaction = 0;
  syncValidTransaction = async () => {
    const { account, parentAccount } = this.props;
    if (!account) return;
    const mainAccount = getMainAccount(account, parentAccount);
    const { transaction } = this.state;
    const bridge = getAccountBridge(account, parentAccount);
    const nonce = ++this.nonceValidTransaction;
    try {
      const txValidationWarning = await bridge.checkValidTransaction(
        mainAccount,
        transaction,
      );
      if (nonce !== this.nonceValidTransaction) return;

      this.setState(old => {
        if (
          !old.syncValidTransactionError &&
          similarError(old.txValidationWarning, txValidationWarning)
        ) {
          return null;
        }
        return {
          txValidationWarning,
          syncValidTransactionError: null,
        };
      });
    } catch (syncValidTransactionError) {
      if (nonce !== this.nonceValidTransaction) return;
      this.setState(old => {
        if (
          similarError(old.syncValidTransactionError, syncValidTransactionError)
        )
          return null;
        return { syncValidTransactionError };
      });
    }
  };
  nonceUseAllAmount = 0;
  toggleUseAllAmount = async () => {
    const { account, parentAccount } = this.props;
    if (!account) return;
    const bridge = getAccountBridge(account, parentAccount);
    const { transaction: currentTransaction } = this.state;
    const nonce = ++this.nonceUseAllAmount;
    const mainAccount = getMainAccount(account, parentAccount);

    const useAllAmount = !bridge.getTransactionExtra(
      mainAccount,
      currentTransaction,
      "useAllAmount",
    );

    let transaction = bridge.editTransactionExtra(
      mainAccount,
      currentTransaction,
      "useAllAmount",
      useAllAmount,
    );

    transaction = bridge.editTransactionAmount(
      mainAccount,
      transaction,
      BigNumber(0),
    );
    let maxAmount;
    if (useAllAmount)
      maxAmount = await bridge.getMaxAmount(mainAccount, transaction);
    if (nonce !== this.nonceUseAllAmount) return;

    this.setState({ transaction, maxAmount });
  };

  nonceCheckFees = 0;
  checkFees = async () => {
    const { account, parentAccount } = this.props;
    if (!account) return;
    const { transaction } = this.state;
    const mainAccount = getMainAccount(account, parentAccount);
    const nonce = ++this.nonceCheckFees;
    try {
      if (nonce !== this.nonceCheckFees) return;

      await getFeesForTransaction({
        account: mainAccount,
        transaction,
      });
    } catch (syncEnoughGasError) {
      this.setState(old => {
        if (similarError(old.syncEnoughGasError, syncEnoughGasError))
          return null;

        return { syncEnoughGasError };
      });
    }
  };

  validate = () => {
    this.syncNetworkInfo();
    this.syncTotalSpent();
    this.syncValidTransaction();
    this.checkFees();
  };

  onNetworkInfoCancel = () => {
    this.setState({ leaving: true });
    const n = this.props.navigation.dangerouslyGetParent();
    if (n) n.goBack();
  };

  onNetworkInfoRetry = () => {
    this.setState({
      syncNetworkInfoError: null,
      syncTotalSpentError: null,
      syncValidTransactionError: null,
    });
  };

  onChange = (amount: BigNumber) => {
    if (!amount.isNaN()) {
      this.setState(({ transaction }, { account, parentAccount }) =>
        !account
          ? null
          : {
              transaction: getAccountBridge(
                account,
                parentAccount,
              ).editTransactionAmount(
                getMainAccount(account, parentAccount),
                transaction,
                amount,
              ),
            },
      );
    }
  };

  blur = () => {
    Keyboard.dismiss();
  };

  navigate = () => {
    const { account, parentAccount, navigation } = this.props;
    if (!account) return;
    const { transaction } = this.state;
    navigation.navigate("SendSummary", {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      transaction,
    });
  };

  render() {
    const { account, parentAccount } = this.props;
    if (!account) return null;
    const mainAccount = getMainAccount(account, parentAccount);
    const {
      transaction,
      syncNetworkInfoError,
      syncValidTransactionError,
      syncTotalSpentError,
      syncEnoughGasError,
      totalSpent,
      leaving,
      maxAmount,
    } = this.state;
    const bridge = getAccountBridge(account, parentAccount);
    const amount = bridge.getTransactionAmount(mainAccount, transaction);
    const useAllAmount = bridge.getTransactionExtra(
      mainAccount,
      transaction,
      "useAllAmount",
    );
    const networkInfo = bridge.getTransactionNetworkInfo(
      mainAccount,
      transaction,
    );
    const pending = !networkInfo && !syncNetworkInfoError;

    const criticalError = syncNetworkInfoError;
    const inlinedError = criticalError
      ? null
      : syncValidTransactionError || syncTotalSpentError || syncEnoughGasError;

    const canNext: boolean =
      !!networkInfo &&
      !criticalError &&
      !inlinedError &&
      !!totalSpent &&
      totalSpent.gt(0) &&
      (!transaction.amount.isZero() ||
        (useAllAmount && !!maxAmount && !maxAmount.isZero()));

    const unit = getAccountUnit(account);

    return (
      <>
        <TrackScreen category="SendFunds" name="Amount" />
        <SafeAreaView style={styles.root}>
          <KeyboardView style={styles.container}>
            <TouchableWithoutFeedback onPress={this.blur}>
              <View style={{ flex: 1 }}>
                <AmountInput
                  editable={!useAllAmount}
                  account={account}
                  onChange={this.onChange}
                  currency={unit.code}
                  value={useAllAmount ? maxAmount : amount}
                  error={inlinedError}
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
                          onValueChange={this.toggleUseAllAmount}
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
                            !pending
                              ? "common.continue"
                              : "send.amount.loadingNetwork"
                          }
                        />
                      }
                      onPress={this.navigate}
                      disabled={!canNext}
                      pending={pending}
                    />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardView>
        </SafeAreaView>

        <GenericErrorBottomModal
          error={leaving ? null : criticalError}
          onClose={this.onNetworkInfoRetry}
          footerButtons={
            <>
              <CancelButton
                containerStyle={styles.button}
                onPress={this.onNetworkInfoCancel}
              />
              <RetryButton
                containerStyle={[styles.button, styles.buttonRight]}
                onPress={this.onNetworkInfoRetry}
              />
            </>
          }
        />
      </>
    );
  }
}

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
