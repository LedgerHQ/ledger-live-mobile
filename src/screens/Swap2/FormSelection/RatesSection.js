// @flow

import { useTheme } from "@react-navigation/native";
import React, { useMemo, useCallback } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { BigNumber } from "bignumber.js";

import {
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";

import type {
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";

import type {
  Exchange,
  ExchangeRate,
} from "@ledgerhq/live-common/lib/exchange/swap/types";

import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import { NavigatorName, ScreenName } from "../../../const";
import GenericInputLink from "./GenericInputLink";
import Changelly from "../../../icons/swap/Changelly";
import Wyre from "../../../icons/swap/Wyre";
import Lock from "../../../icons/Lock";
import Unlock from "../../../icons/Unlock";
import CurrencyIcon from "../../../components/CurrencyIcon";
import LText from "../../../components/LText";
import Button from "../../../components/Button";

export const providerIcons = {
  changelly: Changelly,
  wyre: Wyre,
};

type Props = {
  navigation: *,
  transaction?: Transaction,
  status: TransactionStatus,
  rate?: ExchangeRate,
  rates?: ExchangeRate[],
  provider: any,
  exchange: Exchange,
};

export default function RatesSection({
  navigation,
  transaction,
  status,
  rates,
  rate,
  provider,
  exchange,
}: Props) {
  const { colors } = useTheme();

  const { fromAccount, fromParentAccount, toAccount, toCurrency } = exchange;

  const fromUnit = useMemo(() => fromAccount && getAccountUnit(fromAccount), [
    fromAccount,
  ]);

  const onEditRateProvider = useCallback(() => {
    navigation.navigate(ScreenName.SwapFormV2SelectProviderRate, {
      exchange,
      selectedCurrency: exchange.toCurrency,
      rates,
      rate,
      transaction,
      provider,
    });
  }, [exchange, navigation, provider, rate, rates, transaction]);

  const onEditToAccount = useCallback(() => {
    navigation.navigate(ScreenName.SwapV2FormSelectAccount, {
      exchange,
      selectedCurrency: exchange.toCurrency,
      target: "to",
    });
  }, [exchange, navigation]);

  const onEditFees = () => {
    navigation.navigate(ScreenName.SwapV2FormSelectFees, {
      exchange,
      selectedCurrency: exchange.toCurrency,
      target: "to",
      account: fromAccount,
      parentAccount: fromParentAccount,
      transaction,
    });
  };

  const onAddAccount = useCallback(() => {
    navigation.navigate(NavigatorName.AddAccounts, {
      screen: ScreenName.AddAccountsSelectDevice,
      params: {
        currency: exchange.toCurrency,
        returnToSwap: true,
        onSuccess: () =>
          navigation.navigate(ScreenName.SwapForm, {
            exchange,
          }),
      },
    });
  }, [exchange, navigation]);

  const ProviderIcon = providerIcons[provider];

  const { magnitudeAwareRate, tradeMethod } = rate || {};
  const toAccountName = toAccount ? getAccountName(toAccount) : null;

  return rate ? (
    <Animatable.View animation="fadeIn" useNativeDriver duration={400}>
      <GenericInputLink
        label={<Trans i18nKey="transfer.swap.form.summary.provider" />}
        tooltip={<Trans i18nKey="transfer.swap.form.summary.provider" />}
      >
        {ProviderIcon ? <ProviderIcon size={12} /> : null}
        <LText semiBold style={styles.valueLabel}>
          {provider}
        </LText>
      </GenericInputLink>
      {fromUnit && toCurrency && magnitudeAwareRate ? (
        <GenericInputLink
          label={<Trans i18nKey="transfer.swap.form.summary.method" />}
          tooltip={<Trans i18nKey="transfer.swap.form.summary.method" />}
          onEdit={onEditRateProvider}
        >
          {tradeMethod === "fixed" ? (
            <Lock size={12} color={colors.darkBlue} />
          ) : (
            <Unlock size={12} color={colors.darkBlue} />
          )}
          <LText semiBold style={styles.valueLabel}>
            <CurrencyUnitValue
              value={BigNumber(10).pow(fromUnit.magnitude)}
              unit={fromUnit}
              showCode
            />
            {" = "}
            <CurrencyUnitValue
              unit={toCurrency.units[0]}
              value={BigNumber(10)
                .pow(fromUnit.magnitude)
                .times(magnitudeAwareRate)}
              showCode
            />
          </LText>
        </GenericInputLink>
      ) : null}

      <GenericInputLink
        label={<Trans i18nKey="send.summary.fees" />}
        tooltip={<Trans i18nKey="send.summary.fees" />}
        onEdit={onEditFees}
      >
        {status.estimatedFees && fromUnit ? (
          <LText semiBold style={styles.valueLabel}>
            <CurrencyUnitValue
              unit={fromUnit}
              value={status.estimatedFees}
              showCode
            />
          </LText>
        ) : null}
      </GenericInputLink>
      {toCurrency ? (
        toAccountName ? (
          <GenericInputLink
            label={<Trans i18nKey="transfer.swap.form.target" />}
            onEdit={onEditToAccount}
          >
            <CurrencyIcon currency={toCurrency} size={16} />
            <LText semiBold style={styles.valueLabel}>
              {toAccountName}
            </LText>
          </GenericInputLink>
        ) : (
          <View
            style={[
              styles.addAccountsection,
              { backgroundColor: colors.lightLive },
            ]}
          >
            <LText
              color="live"
              semiBold
              style={styles.addAccountLabel}
              numberOfLines={2}
            >
              <Trans
                i18nKey="transfer.swap.form.noAccount"
                values={{ currency: toCurrency.name }}
              />
            </LText>
            <View style={styles.spacer} />
            <Button
              type="primary"
              onPress={onAddAccount}
              title={<Trans i18nKey="transfer.swap.emptyState.CTAButton" />}
              containerStyle={styles.addAccountButton}
              titleStyle={styles.addAccountButtonLabel}
            />
          </View>
        )
      ) : null}
    </Animatable.View>
  ) : null;
}

const styles = StyleSheet.create({});
