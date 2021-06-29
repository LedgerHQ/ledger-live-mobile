// @flow

import React, { useCallback, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";

import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";

import { ScreenName } from "../../../../../const";
import { TrackScreen } from "../../../../../analytics";
import FilteredSearchBar from "../../../../../components/FilteredSearchBar";
import KeyboardView from "../../../../../components/KeyboardView";
import CurrencyRow from "../../../../../components/CurrencyRow";
import LText from "../../../../../components/LText";

import type { SwapRouteParams } from "..";
import BadSelectionModal from "./BadSelectionModal";

const SEARCH_KEYS = ["name", "ticker"];
const forceInset = { bottom: "always" };

type Props = {
  devMode: boolean,
  navigation: any,
  route: {
    params: SwapRouteParams,
  },
};

const keyExtractor = currency => currency.id;

const renderEmptyList = () => (
  <View style={styles.emptySearch}>
    <LText style={styles.emptySearchText}>
      <Trans i18nKey="common.noCryptoFound" />
    </LText>
  </View>
);

export default function SwapFormSelectCrypto({ route, navigation }: Props) {
  const { exchange, selectableCurrencies, target } = route.params;

  const { colors } = useTheme();

  const isFrom = target === "from";

  const [badSelection, setBadSelection] = useState(null);
  const maybeFilteredCurrencies =
    !isFrom && exchange.fromAccount
      ? selectableCurrencies.filter(
          c => c !== getAccountCurrency(exchange.fromAccount),
        )
      : selectableCurrencies;
  const sortedCryptoCurrencies = useCurrenciesByMarketcap(
    maybeFilteredCurrencies,
  );
  const clearBadSelection = useCallback(() => setBadSelection(null), [
    setBadSelection,
  ]);

  const onPressItem = useCallback(
    (currencyOrToken: CryptoCurrency | TokenCurrency) => {
      if (target === "from") {
        // NB Clear toAccount only if it will collide with the selected currency
        const toAccount =
          exchange.toAccount &&
          getAccountCurrency(exchange.toAccount).id === currencyOrToken.id
            ? undefined
            : exchange.toAccount;

        navigation.navigate(ScreenName.SwapFormSelectAccount, {
          exchange: {
            ...exchange,
            fromAccount: null,
            toAccount,
          },
          selectedCurrency: currencyOrToken,
          target,
        });
      } else {
        navigation.navigate(ScreenName.SwapFormSelectAccount, {
          exchange: {
            ...exchange,
            toAccount: null,
          },
          selectedCurrency: currencyOrToken,
          target,
        });
      }
    },
    [exchange, navigation, target],
  );

  const renderList = useCallback(
    items => (
      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        renderItem={({ item }) => (
          <CurrencyRow isOK currency={item} onPress={onPressItem} />
        )}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      />
    ),
    [onPressItem],
  );

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      forceInset={forceInset}
    >
      <TrackScreen category="Swap" name="SelectCrypto" />
      <KeyboardView style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <FilteredSearchBar
            keys={SEARCH_KEYS}
            inputWrapperStyle={styles.filteredSearchInputWrapperStyle}
            list={sortedCryptoCurrencies}
            renderList={renderList}
            renderEmptySearch={renderEmptyList}
          />
        </View>
      </KeyboardView>
      {badSelection && (
        <BadSelectionModal
          onClose={clearBadSelection}
          currency={badSelection.currency}
          status={badSelection.status}
          target={target}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  searchContainer: {
    paddingTop: 16,
    flex: 1,
  },
  list: {
    paddingBottom: 32,
  },
  filteredSearchInputWrapperStyle: {
    marginHorizontal: 16,
  },
  emptySearch: {
    paddingHorizontal: 16,
  },
  emptySearchText: {
    textAlign: "center",
  },
});
