// @flow

import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
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
import { NavigatorName, ScreenName } from "../../const";
import { useRampCatalogCurrencies } from "./hooks";
import SelectAccountCurrency from "./SelectAccountCurrency";

const forceInset = { bottom: "always" };

export default function OffRamp() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const rampCatalog = useRampCatalog();
  const allCurrencies = useRampCatalogCurrencies(rampCatalog.value.offRamp);

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
        type: "offRamp",
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
    navigation.navigate(NavigatorName.ExchangeSellFlow, {
      screen: ScreenName.ExchangeSelectCurrency,
      params: {
        // initialCurrencySelected: default currency,
        mode: "sell",
        onCurrencyChange,
      },
    });
  }, [navigation, account]);

  const onSelectAccount = useCallback(() => {
    navigation.navigate(NavigatorName.ExchangeSellFlow, {
      screen: ScreenName.ExchangeSelectAccount,
      params: {
        currency,
        mode: "sell",
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
      <TrackScreen category="Sell Crypto" />
      <SelectAccountCurrency
        title={t("exchange.sell.wantToSell")}
        currency={currency}
        account={account}
        onSelectAccount={onSelectAccount}
        onSelectCurrency={onSelectCurrency}
      />
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
          onPress={onContinue}
          disabled={!account || !currency}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  footer: {
    marginTop: 40,
    padding: 16,
  },
  button: {
    alignSelf: "stretch",
    minWidth: "100%",
  },
});
