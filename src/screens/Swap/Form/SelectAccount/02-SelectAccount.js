/* @flow */
import React, { useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";
import {
  accountsSelector,
  flattenAccountsSelector,
} from "../../../../reducers/accounts";
import colors from "../../../../colors";
import { ScreenName } from "../../../../const";
import { TrackScreen } from "../../../../analytics";
import LText from "../../../../components/LText";
import FilteredSearchBar from "../../../../components/FilteredSearchBar";
import AccountCard from "../../../../components/AccountCard";
import KeyboardView from "../../../../components/KeyboardView";
import { formatSearchResults } from "../../../../helpers/formatAccountSearchResults";
import type { SearchResult } from "../../../../helpers/formatAccountSearchResults";
import type { SwapRouteParams } from "..";

const SEARCH_KEYS = ["name", "unit.code", "token.name", "token.ticker"];
const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: {
    params: SwapRouteParams,
  },
};

export default function SwapFormSelectAccount({ navigation, route }: Props) {
  const allAccounts = useSelector(flattenAccountsSelector);
  const accounts = useSelector(accountsSelector);
  const keyExtractor = item => item.account.id;
  const { exchange, target } = route.params;

  const accountKey = target === "from" ? "fromAccount" : "toAccount";
  const parentAccountKey =
    target === "from" ? "fromParentAccount" : "toParentAccount";
  const currency =
    target === "from" ? exchange.fromCurrency : exchange.toCurrency;

  const renderItem = useCallback(
    ({ item: result }: { item: SearchResult }) => {
      const { account } = result;
      return (
        <View
          style={account.type === "Account" ? undefined : styles.tokenCardStyle}
        >
          <AccountCard
            disabled={!result.match}
            account={account}
            style={styles.card}
            onPress={() => {
              navigation.navigate(ScreenName.SwapForm, {
                ...route.params,
                exchange: {
                  ...exchange,
                  [accountKey]: account,
                  [parentAccountKey]: account.parentId
                    ? accounts.find(a => a.id === account.parentId)
                    : null,
                },
              });
            }}
          />
        </View>
      );
    },
    [accounts, exchange, accountKey, parentAccountKey, route, navigation],
  );

  const renderList = useCallback(
    items => {
      const formatedList = formatSearchResults(items, accounts);

      return (
        <FlatList
          data={formatedList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        />
      );
    },
    [accounts, renderItem],
  );

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="ReceiveFunds" name="SelectAccount" />
      <KeyboardView style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <FilteredSearchBar
            keys={SEARCH_KEYS}
            inputWrapperStyle={styles.card}
            list={allAccounts.filter(
              a =>
                getAccountCurrency(a) === currency &&
                (target === "to" || a.balance.gt(0)),
            )}
            renderList={renderList}
            renderEmptySearch={() => (
              <View style={styles.emptyResults}>
                <LText style={styles.emptyText}>
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
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tokenCardStyle: {
    marginLeft: 26,
    paddingLeft: 7,
    borderLeftWidth: 1,
    borderLeftColor: colors.fog,
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
    color: colors.fog,
  },
});
