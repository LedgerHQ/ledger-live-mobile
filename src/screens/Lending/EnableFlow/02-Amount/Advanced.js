/* @flow */
import invariant from "invariant";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { Trans, useTranslation } from "react-i18next";
import type {
  Transaction,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import {
  findCompoundToken,
  formatCurrencyUnit,
} from "@ledgerhq/live-common/lib/currencies";
import { accountScreenSelector } from "../../../../reducers/accounts";
import colors, { rgba } from "../../../../colors";
import { ScreenName } from "../../../../const";
import { TrackScreen } from "../../../../analytics";
import LText from "../../../../components/LText";
import Button from "../../../../components/Button";
import RetryButton from "../../../../components/RetryButton";
import CancelButton from "../../../../components/CancelButton";
import GenericErrorBottomModal from "../../../../components/GenericErrorBottomModal";

const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  transaction: Transaction,
  currency: TokenCurrency,
};

export default function EnableAdvanced({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { currency } = route.params;
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  invariant(
    account && account.type === "TokenAccount",
    "token account required",
  );

  const {
    transaction,
    setTransaction,
    status,
    bridgePending,
    bridgeError,
  } = useBridgeTransaction(() => {
    const bridge = getAccountBridge(account, parentAccount);
    const ctoken = findCompoundToken(account.token);

    // $FlowFixMe
    const t = bridge.createTransaction(account);

    const transaction = bridge.updateTransaction(t, {
      recipient: ctoken?.contractAddress || "",
      mode: "erc20.approve",
      useAllAmount: true,
      gasPrice: null,
      userGasLimit: null,
      subAccountId: account.id,
    });

    return { account, parentAccount, transaction };
  });

  const onContinue = useCallback(() => {
    navigation.navigate(ScreenName.SendSummary, {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      transaction,
    });
  }, [account, parentAccount, navigation, transaction]);

  const onBridgeErrorCancel = useCallback(() => {
    const parent = navigation.dangerouslyGetParent();
    if (parent) parent.goBack();
  }, [navigation]);

  const onBridgeErrorRetry = useCallback(() => {
    if (!transaction) return;
    const bridge = getAccountBridge(account, parentAccount);
    setTransaction(bridge.updateTransaction(transaction, {}));
  }, [setTransaction, account, parentAccount, transaction]);

  if (!account || !transaction) return null;

  return (
    <>
      <TrackScreen category="SendFunds" name="Amount" />
      <SafeAreaView style={styles.root} forceInset={forceInset}>
        <View style={styles.container}></View>
        <View style={styles.bottomWrapper}>
          <View style={styles.continueWrapper}>
            <Button
              event="FreezeAmountContinue"
              type="primary"
              title={<Trans i18nKey="common.continue" />}
              onPress={onContinue}
              disabled={!!status.errors.amount || bridgePending}
              pending={bridgePending}
            />
          </View>
        </View>
      </SafeAreaView>

      <GenericErrorBottomModal
        error={bridgeError}
        onClose={onBridgeErrorRetry}
        footerButtons={
          <>
            <CancelButton
              containerStyle={styles.button}
              onPress={onBridgeErrorCancel}
            />
            <RetryButton
              containerStyle={[styles.button, styles.buttonRight]}
              onPress={onBridgeErrorRetry}
            />
          </>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "stretch",
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
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonRight: {
    marginLeft: 8,
  },
  balanceLabel: {
    position: "absolute",
    bottom: -28,
    height: 20,
    lineHeight: 20,
    borderRadius: 4,
    color: colors.grey,
    backgroundColor: colors.lightFog,
    width: "auto",
    flexGrow: 1,
    fontSize: 11,
    paddingHorizontal: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 54,
  },
  label: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.darkBlue,
    marginVertical: 8,
  },
  liveLabel: {
    fontSize: 16,
    color: colors.live,
    backgroundColor: colors.lightLive,
    borderRadius: 4,
    paddingHorizontal: 4,
    height: 24,
    lineHeight: 24,
    marginVertical: 8,
  },
  currencyIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
