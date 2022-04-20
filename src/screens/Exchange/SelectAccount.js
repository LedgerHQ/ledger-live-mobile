/* @flow */

import { accountWithMandatoryTokens } from "@ledgerhq/live-common/lib/account/helpers";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { TrackScreen } from "../../analytics";
import AccountCard from "../../components/AccountCard";
import Button from "../../components/Button";
import FilteredSearchBar from "../../components/FilteredSearchBar";
import KeyboardView from "../../components/KeyboardView";
import LText from "../../components/LText";
import { NavigatorName, ScreenName } from "../../const";
import type { SearchResult } from "../../helpers/formatAccountSearchResults";
import { formatSearchResults } from "../../helpers/formatAccountSearchResults";
import InfoIcon from "../../icons/Info";
import PlusIcon from "../../icons/Plus";
import type { AccountTuple } from "./hooks";

const SEARCH_KEYS = ["name", "unit.code", "token.name", "token.ticker"];

type Props = {
  navigation: any,
  route: {
    params: {
      mode: "buy" | "sell",
      currency: CryptoCurrency | TokenCurrency,
      onAccountChange: (selectedAccount: Account | AccountLike) => void,
      tuples: AccountTuple[],
      analyticsPropertyFlow?: string,
    },
  },
};

export default function SelectAccount({ navigation, route }: Props) {
  const { colors } = useTheme();
  const {
    mode,
    currency,
    analyticsPropertyFlow,
    onAccountChange,
    tuples,
  } = route.params;

  const enhancedAccounts = useMemo(() => {
    const filteredAccounts = tuples
      .map(t => t.account)
      .filter(
        acc =>
          acc &&
          acc.currency &&
          acc.currency.id ===
            (currency.type === "TokenCurrency"
              ? currency.parentCurrency.id
              : currency.id),
      );
    if (currency.type === "TokenCurrency") {
      return filteredAccounts.map(acc =>
        accountWithMandatoryTokens(acc, [currency]),
      );
    }
    return filteredAccounts;
  }, [tuples, currency]);

  const allAccounts = useMemo(() => {
    const accounts = enhancedAccounts;
    if (currency.type === "TokenCurrency") {
      const subAccounts = tuples.map(t => t.subAccount);

      for (let i = 0; i < subAccounts.length; i++) {
        accounts.push(subAccounts[i]);
      }
    }

    return accounts;
  }, [enhancedAccounts, currency, tuples]);

  const { t } = useTranslation();

  const keyExtractor = item => item.account.id;
  const renderItem = useCallback(
    ({ item: result }: { item: SearchResult }) => {
      const { account } = result;
      return (
        <View
          style={
            account.type === "Account"
              ? undefined
              : [styles.tokenCardStyle, { borderLeftColor: colors.fog }]
          }
        >
          <AccountCard
            disabled={!result.match}
            account={account}
            style={styles.card}
            onPress={() => {
              onAccountChange && onAccountChange(account);
              navigation.navigate(NavigatorName.Exchange, {
                screen:
                  mode === "buy"
                    ? ScreenName.ExchangeBuy
                    : ScreenName.ExchangeSell,
              });
            }}
          />
        </View>
      );
    },
    [colors.fog, navigation, mode],
  );

  const elligibleAccountsForSelectedCurrency = useMemo(
    () =>
      allAccounts.filter(
        account =>
          (account.type === "TokenAccount"
            ? account.token.id
            : account.currency.id) === currency.id,
      ),
    [allAccounts],
  );

  const onAddAccount = useCallback(() => {
    if (currency && currency.type === "TokenCurrency") {
      navigation.navigate(NavigatorName.AddAccounts, {
        token: currency,
        analyticsPropertyFlow,
      });
    } else {
      navigation.navigate(NavigatorName.AddAccounts, {
        currency,
        analyticsPropertyFlow,
      });
    }
  }, [analyticsPropertyFlow, currency, navigation]);

  const renderList = useCallback(
    items => {
      // $FlowFixMe seriously WTF (60 errors just on this 😱)
      const formatedList = formatSearchResults(items, enhancedAccounts);
      return (
        <FlatList
          data={formatedList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <Button
              containerStyle={styles.addButton}
              event="ExchangeStartBuyFlow"
              type="tertiary"
              outline={false}
              IconLeft={PlusIcon}
              title={t("exchange.buy.emptyState.CTAButton")}
              onPress={onAddAccount}
            />
          }
          keyboardDismissMode="on-drag"
        />
      );
    },
    [enhancedAccounts, renderItem, t, onAddAccount],
  );

  // empty state if no accounts available for this currency
  if (!elligibleAccountsForSelectedCurrency.length) {
    return (
      <View style={styles.emptyStateBody}>
        <View
          style={[styles.iconContainer, { backgroundColor: colors.lightLive }]}
        >
          <InfoIcon size={22} color={colors.live} />
        </View>
        <LText semiBold style={styles.title}>
          {t("exchange.buy.emptyState.title", { currency: currency.name })}
        </LText>
        <LText style={styles.description} color="smoke">
          {t("exchange.buy.emptyState.description", {
            currency: currency.name,
          })}
        </LText>
        <View style={styles.buttonContainer}>
          <Button
            containerStyle={styles.button}
            event="ExchangeStartBuyFlow"
            type="primary"
            title={t("exchange.buy.emptyState.CTAButton")}
            onPress={onAddAccount}
          />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <TrackScreen category="ReceiveFunds" name="SelectAccount" />
      <KeyboardView style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <FilteredSearchBar
            keys={SEARCH_KEYS}
            inputWrapperStyle={styles.card}
            list={elligibleAccountsForSelectedCurrency}
            renderList={renderList}
            renderEmptySearch={() => (
              <View style={styles.emptyResults}>
                <LText style={styles.emptyText} color="fog">
                  <Trans i18nKey="transfer.receive.noAccount" />
                </LText>
              </View>
            )}
          />
        </View>
      </KeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addAccountButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
  },
  root: {
    flex: 1,
  },
  tokenCardStyle: {
    marginLeft: 26,
    paddingLeft: 7,
    borderLeftWidth: 1,
  },
  card: {
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  searchContainer: {
    paddingTop: 18,
    flex: 1,
  },
  list: {
    paddingTop: 8,
  },
  emptyResults: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
  },
  emptyStateBody: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 50,
    marginBottom: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  buttonContainer: {
    paddingTop: 24,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: "row",
  },
  button: {
    flex: 1,
  },
  addButton: {
    marginTop: 16,
    paddingLeft: 8,
    alignItems: "flex-start",
  },
});
