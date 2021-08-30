// @flow

import { useTheme } from "@react-navigation/native";
import React, { useMemo, useCallback, useState, useEffect } from "react";
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
import { useDebounce } from "@ledgerhq/live-common/lib/hooks/useDebounce";

import { Trans } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { BigNumber } from "bignumber.js";
import AccountAmountRow from "./FormSelection/AccountAmountRow";
import Button from "../../components/Button";
import LText from "../../components/LText";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import Switch from "../../components/Switch";

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
  providers: any,
  provider: any,
};

export default function SwapForm({
  route,
  navigation,
  defaultAccount,
  defaultParentAccount,
  // providers,
  provider,
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

  const [maxSpendable, setMaxSpendable] = useState();

  const { fromAccount, fromParentAccount /* , toAccount */ } = exchange;
  // const fromCurrency = fromAccount ? getAccountCurrency(fromAccount) : null;
  // const toCurrency = toAccount ? getAccountCurrency(toAccount) : null;

  const {
    status,
    transaction,
    setTransaction,
    bridgePending,
  } = useBridgeTransaction(() => ({
    account: fromAccount,
    parentAccount: fromParentAccount,
  }));

  const debouncedTransaction = useDebounce(transaction, 500);

  const toggleUseAllAmount = useCallback(() => {
    const bridge = getAccountBridge(fromAccount, fromParentAccount);

    setTransaction(
      bridge.updateTransaction(
        transaction || bridge.createTransaction(fromAccount),
        {
          amount: maxSpendable || BigNumber(0),
          useAllAmount: !transaction?.useAllAmount,
        },
      ),
    );
  }, [
    fromAccount,
    fromParentAccount,
    setTransaction,
    transaction,
    maxSpendable,
  ]);

  useEffect(() => {
    if (!fromAccount) return;

    let cancelled = false;
    getAccountBridge(fromAccount, fromParentAccount)
      .estimateMaxSpendable({
        account: fromAccount,
        parentAccount: fromParentAccount,
        transaction: debouncedTransaction,
      })
      .then(estimate => {
        if (cancelled) return;

        setMaxSpendable(estimate);
      });

    // eslint-disable-next-line consistent-return
    return () => {
      cancelled = true;
    };
  }, [fromAccount, fromParentAccount, debouncedTransaction]);

  const unit = useMemo(() => fromAccount && getAccountUnit(fromAccount), [
    fromAccount,
  ]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <AccountAmountRow
        navigation={navigation}
        exchange={exchange}
        transaction={transaction}
        onUpdateTransaction={setTransaction}
        status={status}
        bridgePending={bridgePending}
        provider={provider}
        useAllAmount={transaction?.useAllAmount}
      />
      <View>
        <View style={styles.available}>
          <View style={styles.availableLeft}>
            <LText>
              <Trans i18nKey="transfer.swap.form.amount.available" />
            </LText>
            <LText semiBold>
              {maxSpendable ? (
                <CurrencyUnitValue showCode unit={unit} value={maxSpendable} />
              ) : (
                "-"
              )}
            </LText>
          </View>
          {maxSpendable ? (
            <View style={styles.availableRight}>
              <LText style={styles.maxLabel}>
                <Trans i18nKey="transfer.swap.form.amount.useMax" />
              </LText>
              <Switch
                style={styles.switch}
                value={transaction?.useAllAmount}
                onValueChange={toggleUseAllAmount}
              />
            </View>
          ) : null}
        </View>
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
  available: {
    flexDirection: "row",
    display: "flex",
    flexGrow: 1,
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
  switch: {
    opacity: 0.99,
  },
});
