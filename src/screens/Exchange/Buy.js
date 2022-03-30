// @flow

import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { useRampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";
import { currenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import {
  accountWithMandatoryTokens,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account/helpers";
import { isAccountEmpty } from "@ledgerhq/live-common/lib/account";
import { useSelector } from "react-redux";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import TrackScreen from "../../analytics/TrackScreen";
import Button from "../../components/Button";
import { NavigatorName, ScreenName } from "../../const";
import { useRampCatalogCurrencies } from "./hooks";
import SelectAccountCurrency from "./SelectAccountCurrency";
import { track } from "../../analytics";
import { accountsSelector } from "../../reducers/accounts";

const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: {
    params: {
      selectedCurrencyId?: string,
      accountId?: string,
      parentId?: string,
    },
  },
};

export default function OnRamp({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const rampCatalog = useRampCatalog();
  const allCurrencies = useRampCatalogCurrencies(
    rampCatalog && rampCatalog.value ? rampCatalog.value.onRamp : [],
  );
  const { selectedCurrencyId, accountId } = route.params || {};
  const accounts = useSelector(accountsSelector);

  const [currency, setCurrency] = useState<
    CryptoCurrency | TokenCurrency | null,
  >(null);
  const [account, setAccount] = useState<Account | AccountLike | null>(null);

  const selectAccount = accountCurrency => {
    if (accountId) {
      setAccount(accounts.find(acc => acc.id === accountId));
    } else {
      if (!accountCurrency) return;

      const filteredAccounts = accounts.filter(
        acc =>
          acc.currency.id ===
          (accountCurrency.type === "TokenCurrency"
            ? accountCurrency.parentCurrency.id
            : accountCurrency.id),
      );
      if (accountCurrency.type === "TokenCurrency") {
        return filteredAccounts.map(acc =>
          accountWithMandatoryTokens(acc, [accountCurrency]),
        );
      }
      setAccount(filteredAccounts[0] || null);
    }
  };

  useEffect(() => {
    if (!allCurrencies) return;

    if (selectedCurrencyId) {
      const selectedCurrency = allCurrencies.find(
        currency => currency.id === selectedCurrencyId,
      );
      setCurrency(selectedCurrency);
      selectAccount(selectedCurrency);
    } else {
      currenciesByMarketcap(allCurrencies).then(sortedCurrencies => {
        setCurrency(sortedCurrencies[0]);
        selectAccount(sortedCurrencies[0]);
      });
    }
  }, [rampCatalog.value]);

  const onContinue = useCallback(() => {
    if (account) {
      navigation.navigate(NavigatorName.ProviderList, {
        accountId: account.id,
        accountAddress: account.freshAddress,
        currency,
        type: "onRamp",
      });

      track("Buy Crypto Continue Button", {
        currencyName: getAccountCurrency(account).name,
        isEmpty: isAccountEmpty(account),
      });
    }
  }, [account, currency, navigation]);

  const onCurrencyChange = useCallback(
    (selectedCurrency: CryptoCurrency | TokenCurrency) => {
      console.log(selectedCurrency);
      setCurrency(selectedCurrency);
      selectAccount(selectedCurrency);
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
      <TrackScreen category="Multibuy" name="Buy" />
      <SelectAccountCurrency
        title={t("exchange.buy.wantToBuy")}
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
        {account ? (
          <Button
            containerStyle={styles.button}
            type={"primary"}
            title={t("common.continue")}
            onPress={onContinue}
            disabled={!account || !currency}
          />
        ) : (
          <Button
            containerStyle={styles.button}
            type={"primary"}
            title={t("exchange.buy.emptyState.CTAButton")}
            onPress={() =>
              navigation.navigate(NavigatorName.AddAccounts, { currency })
            }
          />
        )}
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
