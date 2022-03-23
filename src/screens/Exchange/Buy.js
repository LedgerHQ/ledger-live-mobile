// @flow

import React, { useCallback, useState } from "react";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useTranslation } from "react-i18next";
import { useNavigation, useTheme } from "@react-navigation/native";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import TrackScreen from "../../analytics/TrackScreen";
import Button from "../../components/Button";
import LText from "../../components/LText";
import DropdownArrow from "../../icons/DropdownArrow";
import { NavigatorName, ScreenName } from "../../const";
import CurrencyRow from "../../components/CurrencyRow";
import AccountCard from "../../components/AccountCard";

const forceInset = { bottom: "always" };

export default function Buy() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [currency, setCurrency] = useState<CryptoCurrency | TokenCurrency | null>(null);
  const [account, setAccount] = useState<Account | AccountLike | null>(null);

  const onContinue = useCallback(() => {}, []);

  const onCurrencyChange = useCallback(
    (selectedCurrency: CryptoCurrency | TokenCurrency) => {
      setCurrency(selectedCurrency);
    },
    [],
  );

  const onAccountChange = useCallback(
    (selectedAccount: Account | AccountLike) => {
      setAccount(selectedAccount);
    },
    [],
  );

  const onSelectCurrency = useCallback(() => {
    navigation.navigate(NavigatorName.ExchangeBuyFlow, {
      screen: ScreenName.ExchangeSelectCurrency,
      params: {
        // initialCurrencySelected: default currency,
        mode: "buy",
        onCurrencyChange,
      },
    });
  }, [navigation, account]);

  const onSelectAccount = useCallback(() => {
    navigation.navigate(NavigatorName.ExchangeBuyFlow, {
      screen: ScreenName.ExchangeSelectAccount,
      params: {
        currency,
        mode: "buy",
        onAccountChange,
      },
    });
  }, [navigation, currency]);

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.card,
          paddingTop: extraStatusBarPadding,
        },
      ]}
      forceInset={forceInset}
    >
      <TrackScreen category="Buy Crypto" />
      <View style={styles.body}>
        <View
          style={[
            styles.accountAndCurrencySelect,
            { borderColor: colors.border },
          ]}
        >
          <LText>{t("exchange.buy.wantToBuy")}</LText>
          <TouchableOpacity onPress={() => onSelectCurrency()}>
            <View style={[styles.select, { borderColor: colors.border }]}>
              {currency ? (
                <CurrencyRow currency={currency} onPress={() => {}} />
              ) : (
                <LText>{t("exchange.buy.selectCurrency")}</LText>
              )}
              <DropdownArrow size={10} color={colors.grey} />
            </View>
          </TouchableOpacity>
          <LText style={styles.itemMargin}>
            {t("exchange.buy.selectAccount")}
          </LText>
          <TouchableOpacity onPress={() => onSelectAccount()}>
            <View style={[styles.select, { borderColor: colors.border }]}>
              {account ? (
                <AccountCard
                  disabled={false}
                  account={account}
                  style={styles.card}
                  onPress={() => {}}
                />
              ) : (
                <LText>{t("exchange.buy.selectAccount")}</LText>
              )}
              <DropdownArrow size={10} color={colors.grey} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.footer,
          {
            ...Platform.select({
              android: {
                borderTopColor: "rgba(20, 37, 51, 0.1)",
                borderTopWidth: 1,
              },
              ios: {
                shadowColor: "rgb(20, 37, 51)",
                shadowRadius: 14,
                shadowOpacity: 0.04,
                shadowOffset: {
                  width: 0,
                  height: -4,
                },
              },
            }),
          },
        ]}
      >
        <Button
          containerStyle={styles.button}
          type={"primary"}
          title={t("common.continue")}
          onPress={() => onContinue()}
          disabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  accountAndCurrencySelect: {
    width: "100%",
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  select: {
    height: 56,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 120,
    padding: 14,
    marginTop: 12,
  },
  itemMargin: {
    marginTop: 40,
  },
  footer: {
    marginTop: 40,
    padding: 16,
  },
  button: {
    alignSelf: "stretch",
    minWidth: "100%",
  },
  card: {
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
});
