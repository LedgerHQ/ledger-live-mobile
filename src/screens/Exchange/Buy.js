// @flow

import React, { useCallback, useState, useEffect } from "react";
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
import { useRampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";
import { currenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import TrackScreen from "../../analytics/TrackScreen";
import Button from "../../components/Button";
import LText from "../../components/LText";
import DropdownArrow from "../../icons/DropdownArrow";
import { NavigatorName, ScreenName } from "../../const";
import CurrencyRow from "../../components/CurrencyRow";
import AccountCard from "../../components/AccountCard";
import { useRampCatalogCurrencies } from "./hooks";

const forceInset = { bottom: "always" };

export default function Buy() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const rampCatalog = useRampCatalog();
  const allCurrencies = useRampCatalogCurrencies(rampCatalog.value.onRamp);

  const [currency, setCurrency] = useState<
    CryptoCurrency | TokenCurrency | null,
  >(null);
  const [account, setAccount] = useState<Account | AccountLike | null>(null);

  useEffect(() => {
    currenciesByMarketcap(allCurrencies).then(sortedCurrencies => {
      setCurrency(sortedCurrencies[0]);
    });
  }, []);

  const onContinue = useCallback(() => {
    if (account) {
      navigation.navigate(NavigatorName.ProviderList, {
        accountId: account.id,
        accountAddress: account.freshAddress,
        currency,
        type: "onRamp",
      });
    }
  }, [account, currency, navigation]);

  const onCurrencyChange = useCallback(
    (selectedCurrency: CryptoCurrency | TokenCurrency) => {
      setAccount(null);
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
          <LText secondary semiBold>
            {t("exchange.buy.wantToBuy")}
          </LText>
          <TouchableOpacity onPress={() => onSelectCurrency()}>
            <View style={[styles.select, { borderColor: colors.border }]}>
              {currency ? (
                <View>
                  <CurrencyRow
                    currency={currency}
                    onPress={() => {}}
                    iconSize={32}
                  />
                </View>
              ) : (
                <LText style={styles.placeholder}>
                  {t("exchange.buy.selectCurrency")}
                </LText>
              )}
              <DropdownArrow size={10} color={colors.grey} />
            </View>
          </TouchableOpacity>
          <LText secondary semiBold style={styles.itemMargin}>
            {t("exchange.buy.selectAccount")}
          </LText>
          <TouchableOpacity onPress={() => onSelectAccount()}>
            <View style={[styles.select, { borderColor: colors.border }]}>
              {account ? (
                <AccountCard
                  style={styles.card}
                  disabled={false}
                  account={account}
                  onPress={() => {}}
                />
              ) : (
                <LText style={styles.placeholder}>
                  {t("exchange.buy.selectAccount")}
                </LText>
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
          disabled={!account && !currency}
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
    paddingVertical: 14,
    marginTop: 12,
    paddingRight: 16,
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
  placeholder: {
    marginLeft: 16,
  },
  card: {
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
});
