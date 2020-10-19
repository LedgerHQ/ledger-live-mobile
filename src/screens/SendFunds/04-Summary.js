/* @flow */
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import React, { useState, useCallback, Component } from "react";
import { View, StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { NotEnoughGas } from "@ledgerhq/errors";
import { useTheme } from "@react-navigation/native";
import { accountScreenSelector } from "../../reducers/accounts";
import { ScreenName, NavigatorName } from "../../const";
import { TrackScreen } from "../../analytics";
import { useTransactionChangeFromNavigation } from "../../logic/screenTransactionHooks";
import Button from "../../components/Button";
import LText from "../../components/LText";
import TranslatedError from "../../components/TranslatedError";
import SendRowsCustom from "../../components/SendRowsCustom";
import SendRowsFee from "../../components/SendRowsFee";
import SummaryFromSection from "./SummaryFromSection";
import SummaryToSection from "./SummaryToSection";
import SummaryAmountSection from "./SummaryAmountSection";
import SummaryTotalSection from "./SummaryTotalSection";
import SectionSeparator from "../../components/SectionSeparator";
import AlertTriangle from "../../icons/AlertTriangle";
import ConfirmationModal from "../../components/ConfirmationModal";
import NavigationScrollView from "../../components/NavigationScrollView";
import Info from "../../icons/Info";

const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  transaction: Transaction,
};

export default function SendSummary({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const {
    transaction,
    setTransaction,
    status,
    bridgePending,
  } = useBridgeTransaction(() => ({
    transaction: route.params.transaction,
    account,
    parentAccount,
  }));

  // handle any edit screen changes like fees changes
  useTransactionChangeFromNavigation(setTransaction);

  const [highFeesOpen, setHighFeesOpen] = useState(false);

  const navigateToNext = useCallback(() => {
    navigation.navigate(ScreenName.SendSelectDevice, {
      ...route.params,
      transaction,
      status,
    });
  }, [navigation, route, transaction, status]);

  const onAcceptFees = useCallback(() => {
    navigateToNext();

    setHighFeesOpen(false);
  }, [navigateToNext, setHighFeesOpen]);

  const onRejectFees = useCallback(() => {
    setHighFeesOpen(false);
  }, [setHighFeesOpen]);

  const onContinue = useCallback(() => {
    const { warnings } = status;
    if (Object.keys(warnings).includes("feeTooHigh")) {
      setHighFeesOpen(true);
      return;
    }
    navigateToNext();
  }, [navigateToNext, setHighFeesOpen, status]);

  const onBuyEth = useCallback(() => {
    navigation.navigate(NavigatorName.Exchange, {
      screen: ScreenName.Exchange,
      params: {
        accountId: account && account.id,
        parentId: parentAccount && parentAccount.id,
      },
    });
  }, [account, parentAccount, navigation]);

  if (!account || !transaction || !transaction.recipient) return null; // FIXME why is recipient sometimes empty?
  const { amount, totalSpent, errors } = status;
  const { transaction: transactionError } = errors;
  const error = status.errors[Object.keys(status.errors)[0]];
  const mainAccount = getMainAccount(account, parentAccount);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.white }]}
      forceInset={forceInset}
    >
      <TrackScreen category="SendFunds" name="Summary" />
      <NavigationScrollView style={styles.body}>
        <SummaryFromSection account={account} parentAccount={parentAccount} />
        <VerticalConnector
          style={[styles.verticalConnector, { borderColor: colors.lightFog }]}
        />
        <SummaryToSection recipient={transaction.recipient} />
        {status.warnings.recipient ? (
          <LText style={styles.warning} color="orange">
            <TranslatedError error={status.warnings.recipient} />
          </LText>
        ) : null}
        <SendRowsCustom
          transaction={transaction}
          account={mainAccount}
          navigation={navigation}
        />
        <SectionSeparator lineColor={colors.lightFog} />
        <SummaryAmountSection
          account={account}
          parentAccount={parentAccount}
          amount={amount}
        />
        <SendRowsFee
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          navigation={navigation}
        />
        {error ? (
          <View style={styles.gasPriceError}>
            <View style={{ padding: 4 }}>
              <Info size={12} color={colors.alert} />
            </View>
            <LText style={[styles.error, styles.gasPriceErrorText]}>
              <TranslatedError error={error} />
            </LText>
          </View>
        ) : null}
        {!amount.eq(totalSpent) ? (
          <>
            <SectionSeparator lineColor={colors.lightFog} />
            <SummaryTotalSection
              account={account}
              parentAccount={parentAccount}
              amount={totalSpent}
            />
          </>
        ) : null}
      </NavigationScrollView>
      <View style={styles.footer}>
        <LText style={styles.error} color="alert">
          <TranslatedError error={transactionError} />
        </LText>
        {error && error instanceof NotEnoughGas ? (
          <Button
            event="SummaryBuyEth"
            type="primary"
            title={<Trans i18nKey="common.buyEth" />}
            containerStyle={styles.continueButton}
            onPress={onBuyEth}
          />
        ) : (
          <Button
            event="SummaryContinue"
            type="primary"
            title={<Trans i18nKey="common.continue" />}
            containerStyle={styles.continueButton}
            onPress={onContinue}
            disabled={bridgePending || !!transactionError}
          />
        )}
      </View>
      <ConfirmationModal
        isOpened={highFeesOpen}
        onClose={onRejectFees}
        onConfirm={onAcceptFees}
        Icon={AlertTriangle}
        confirmationDesc={
          <Trans i18nKey="send.highFeeModal">
            {"Be careful, your fees represent more than "}
            <LText bold>10%</LText>
            {" of the amount. Do you want to continue?"}
          </Trans>
        }
        confirmButtonText={<Trans i18nKey="common.continue" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
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
  },
  error: {
    fontSize: 12,
    marginBottom: 5,
  },
  warning: {
    fontSize: 14,
    marginBottom: 16,
    paddingLeft: 50,
  },
  verticalConnector: {
    position: "absolute",
    borderLeftWidth: 2,
    height: 20,
    top: 60,
    left: 16,
  },
  gasPriceError: {
    marginTop: 16,
    flexDirection: "row",
  },
  gasPriceErrorText: {
    paddingLeft: 4,
    fontSize: 14,
  },
});

class VerticalConnector extends Component<*> {
  render() {
    const { style } = this.props;
    return <View style={style} />;
  }
}
