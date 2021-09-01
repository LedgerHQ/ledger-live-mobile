// @flow
import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import type {
  Exchange,
  SwapTransaction,
} from "@ledgerhq/live-common/lib/exchange/swap/types";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";

import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import { AmountRequired } from "@ledgerhq/errors";
import { BigNumber } from "bignumber.js";

import LText from "../../../components/LText";
import AccountSelect from "./AccountSelect";
import CurrencyInput from "../../../components/CurrencyInput";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import TranslatedError from "../../../components/TranslatedError";
import getFontStyle from "../../../components/LText/getFontStyle";
import CounterValue from "../../../components/CounterValue";
import CurrencyTargetSelect from "./CurrencyTargetSelect";

type Props = {
  navigation: *,
  exchange: Exchange,
  useAllAmount: boolean,
  transaction: SwapTransaction,
  onUpdateTransaction: (transaction: SwapTransaction) => void,
  status?: *,
  bridgePending: boolean,
  provider: any,
  providers: any,
  fetchingRate?: boolean,
  rate: any,
};

export default function AccountAmountRow({
  navigation,
  useAllAmount,
  exchange,
  transaction,
  onUpdateTransaction,
  status,
  bridgePending,
  provider,
  providers,
  fetchingRate,
  rate,
}: Props) {
  const { colors } = useTheme();
  const { fromAccount, fromParentAccount } = exchange;

  const onAmountChange = useCallback(
    amount => {
      const bridge = getAccountBridge(fromAccount, fromParentAccount);

      onUpdateTransaction(
        bridge.updateTransaction(
          transaction || bridge.createTransaction(fromAccount),
          { amount },
        ),
      );
    },
    [fromAccount, fromParentAccount, onUpdateTransaction, transaction],
  );

  const fromUnit = useMemo(() => fromAccount && getAccountUnit(fromAccount), [
    fromAccount,
  ]);

  const toCurrency = exchange?.toCurrency;
  const toUnit = toCurrency?.units[0];

  const amountError =
    transaction?.amount.gt(0) &&
    (status?.errors?.gasPrice || status?.errors?.amount);

  const hideError =
    bridgePending ||
    (useAllAmount && amountError && amountError instanceof AmountRequired);

  const toValue = rate
    ? transaction.amount
        .times(rate.magnitudeAwareRate)
        .minus(rate.payoutNetworkFees || 0)
    : null;

  return (
    <View>
      <View>
        <LText semiBold color="grey" style={styles.label}>
          <Trans i18nKey="transfer.swap.form.from" />
        </LText>
        <View style={styles.root}>
          <AccountSelect exchange={exchange} navigation={navigation} />
          <View style={styles.wrapper}>
            {fromUnit ? (
              <CurrencyInput
                editable={!useAllAmount}
                onChange={onAmountChange}
                unit={fromUnit}
                value={transaction?.amount}
                isActive
                inputStyle={styles.inputText}
                hasError={!hideError && !!amountError}
              />
            ) : (
              <LText semiBold color="grey" style={styles.inputText}>
                0
              </LText>
            )}
            <LText style={[styles.error]} color={"alert"} numberOfLines={2}>
              <TranslatedError
                error={(!hideError && amountError) || undefined}
              />
            </LText>
          </View>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.fog }]} />
      <View>
        <LText semiBold color="grey" style={styles.label}>
          <Trans i18nKey="transfer.swap.form.to" />
        </LText>
        <View style={styles.root}>
          <CurrencyTargetSelect
            exchange={exchange}
            navigation={navigation}
            provider={provider}
            providers={providers}
          />
          <View style={styles.wrapper}>
            {fetchingRate ? (
              <ActivityIndicator color={colors.grey} animating />
            ) : toUnit && toCurrency ? (
              <View>
                <LText semiBold color="grey" style={styles.inputText}>
                  <CurrencyUnitValue
                    unit={toUnit}
                    value={toValue ?? BigNumber(0)}
                  />
                </LText>
                <LText semiBold color="grey" style={styles.subText}>
                  <CounterValue
                    currency={toCurrency}
                    value={toValue ?? BigNumber(0)}
                  />
                </LText>
              </View>
            ) : (
              <LText semiBold color="grey" style={styles.inputText}>
                0
              </LText>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 32,
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    marginVertical: 16,
  },
  wrapper: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    height: 32,
  },
  currency: {
    fontSize: 20,
  },
  active: {
    fontSize: 30,
    ...getFontStyle({ semiBold: true }),
  },
  error: {
    fontSize: 14,
    textAlign: "right",
  },
  inputText: {
    textAlign: "right",
    fontSize: 23,
    lineHeight: 28,
    height: 32,
    padding: 0,
  },
  subText: { textAlign: "right", fontSize: 13 },
});
