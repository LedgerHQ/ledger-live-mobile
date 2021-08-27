// @flow

import { useTheme } from "@react-navigation/native";
import React, { useMemo, useCallback } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import type {
  CryptoCurrency,
  TokenCurrency,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import type {
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types/account";

import type {
  Exchange,
  ExchangeRate,
} from "@ledgerhq/live-common/lib/exchange/swap/types";
import type { CurrenciesStatus } from "@ledgerhq/live-common/lib/exchange/swap/logic";

// import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import { Trans } from "react-i18next";
import AccountAmountRow from "./FormSelection/AccountAmountRow";
import Button from "../../components/Button";

export type SwapRouteParams = {
  exchange: Exchange,
  exchangeRate: ExchangeRate,
  currenciesStatus: CurrenciesStatus,
  selectableCurrencies: (CryptoCurrency | TokenCurrency)[],
  transaction?: Transaction,
  status?: TransactionStatus,
  selectedCurrency: CryptoCurrency | TokenCurrency,
  providers: any,
  provider: any,
  installedApps: any,
  target: "from" | "to",
  rateExpiration?: Date,
};

type Props = {
  route: { params: SwapRouteParams },
  navigation: *,
  defaultAccount: ?AccountLike,
  defaultParentAccount: ?Account,
};

export default function SwapEntrypoint({
  route,
  navigation,
  defaultAccount,
  defaultParentAccount,
}: Props) {
  const { colors } = useTheme();
  const exchange = useMemo(
    () =>
      route.params?.exchange || {
        fromAccount: defaultAccount?.balance.gt(0) ? defaultAccount : undefined,
        fromParentAccount: defaultAccount?.balance.gt(0)
          ? defaultParentAccount
          : undefined,
      },
    [defaultAccount, defaultParentAccount, route.params],
  );

  const onExchangeUpdate = useCallback(
    (exchange: Exchange) => {
      navigation.setParams({ ...route.params, exchange });
    },
    [route.params],
  );

  const { fromAccount, fromParentAccount /* , toAccount */ } = exchange;
  // const fromCurrency = fromAccount ? getAccountCurrency(fromAccount) : null;
  // const toCurrency = toAccount ? getAccountCurrency(toAccount) : null;

  const {
    // status,
    transaction,
    // setTransaction,
    updateTransaction,
    bridgePending,
  } = useBridgeTransaction(() => ({
    account: fromAccount,
    parentAccount: fromParentAccount,
  }));

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <AccountAmountRow
        navigation={navigation}
        exchange={exchange}
        onChange={onExchangeUpdate}
        transaction={transaction}
        onUpdateTransaction={updateTransaction}
      />
      <View style={styles.buttonContainer}>
        <Button
          containerStyle={styles.button}
          event="ExchangeStartBuyFlow"
          type="primary"
          disabled={!!bridgePending}
          title={<Trans i18nKey="transfer.swap.form.tab" />}
          onPress={() => {
            /** move to swap summary */
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 24,
    flexDirection: "row",
  },
});
