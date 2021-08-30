// @flow
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import type {
  Exchange,
  SwapTransaction,
} from "@ledgerhq/live-common/lib/exchange/swap/types";

import {
  getAccountUnit,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";

import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import { AmountRequired } from "@ledgerhq/errors";
import { AccessDeniedError } from "@ledgerhq/live-common/lib/errors";
import { getEnabledTradeMethods } from "@ledgerhq/live-common/lib/exchange/swap/logic";
import { getExchangeRates } from "@ledgerhq/live-common/lib/exchange/swap";
import Config from "react-native-config";
import { useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";
import { swapKYCSelector } from "../../../reducers/settings";

import LText from "../../../components/LText";
import AccountSelect from "./AccountSelect";
import CurrencyInput from "../../../components/CurrencyInput";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import TranslatedError from "../../../components/TranslatedError";
import getFontStyle from "../../../components/LText/getFontStyle";
import CounterValue from "../../../components/CounterValue";

type Props = {
  navigation: *,
  exchange: Exchange,
  useAllAmount: boolean,
  transaction: SwapTransaction,
  onUpdateTransaction: (transaction: SwapTransaction) => void,
  status?: *,
  bridgePending: boolean,
  provider: any,
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
}: Props) {
  const { colors } = useTheme();
  const { fromAccount, fromParentAccount, toAccount } = exchange;

  const swapKYC = useSelector(swapKYCSelector);
  const providerKYC = swapKYC[provider];

  const [error, setError] = useState(null);
  const [rate, setRate] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [rateExpiration, setRateExpiration] = useState(null);

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

  const toUnit = useMemo(() => toAccount && getAccountUnit(toAccount), [
    toAccount,
  ]);

  const toCurrency = useMemo(() => toAccount && getAccountCurrency(toAccount), [
    toAccount,
  ]);

  // eslint-disable-next-line no-unused-vars
  const [tradeMethod, setTradeMethod] = useState<"fixed" | "float">(
    getEnabledTradeMethods[0] || "float",
  );

  useEffect(() => {
    let ignore = false;
    const KYCUserId = Config.SWAP_OVERRIDE_KYC_USER_ID || providerKYC?.id;
    async function getRates() {
      try {
        // $FlowFixMe No idea how to pass this
        const rates = await getExchangeRates(exchange, transaction, KYCUserId);
        if (ignore) return;
        const rate = rates.find(
          rate =>
            rate.tradeMethod === tradeMethod && rate.provider === provider,
        );

        if (rate?.error) {
          if (rate?.error && rate.error instanceof AccessDeniedError) {
            // setShowUnauthorizedRates(true);
          }
          setError(rate.error);
        } else {
          setRate(rate); // FIXME when we have multiple providers this will not be enough
          setRateExpiration(new Date(Date.now() + 60000));
        }
      } catch (error) {
        if (ignore) return;
        setError(error);
      }
    }
    if (!ignore && !error && transaction?.amount.gt(0) && !rate) {
      getRates();
    } else if (transaction?.amount.lte(0)) {
      setRate(null);
    }

    return () => {
      ignore = true;
    };
  }, [
    exchange,
    fromAccount,
    toAccount,
    error,
    transaction,
    tradeMethod,
    rate,
    providerKYC?.id,
    provider,
  ]);

  const amountError =
    transaction?.amount.gt(0) &&
    (status?.errors?.gasPrice || status?.errors?.amount);

  const hideError =
    bridgePending ||
    (useAllAmount && amountError && amountError instanceof AmountRequired);

  return (
    <View>
      <View>
        <LText semiBold color="grey" style={styles.label}>
          <Trans i18nKey="transfer.swap.form.from" />
        </LText>
        <View style={styles.root}>
          <AccountSelect
            exchange={exchange}
            navigation={navigation}
            target="from"
          />
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
          <AccountSelect
            exchange={exchange}
            navigation={navigation}
            target="to"
          />
          <View style={styles.wrapper}>
            {toUnit && toCurrency ? (
              <View>
                <LText semiBold color="grey" style={styles.inputText}>
                  <CurrencyUnitValue
                    unit={toUnit}
                    value={rate?.toAmount ?? BigNumber(0)}
                  />
                </LText>
                <LText semiBold color="grey" style={styles.subText}>
                  <CounterValue
                    currency={toCurrency}
                    value={rate?.toAmount ?? BigNumber(0)}
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
    paddingVertical: 16,
    justifyContent: "space-between",
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
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 18,
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
  inputText: { textAlign: "right", fontSize: 23 },
  subText: { textAlign: "right", fontSize: 13 },
});
