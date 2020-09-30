// @flow

import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View, FlatList } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import type { SwapRouteParams } from "..";
import BadSelectionModal from "./BadSelectionModal";
import { ScreenName } from "../../../../const";
import { TrackScreen } from "../../../../analytics";
import FilteredSearchBar from "../../../../components/FilteredSearchBar";
import KeyboardView from "../../../../components/KeyboardView";
import CurrencyRow from "../../../../components/CurrencyRow";
import LText from "../../../../components/LText";

import colors from "../../../../colors";

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
  const {
    exchange,
    selectableCurrencies,
    currenciesStatus,
    target,
  } = route.params;
  const [badSelection, setBadSelection] = useState(null);
  const maybeFilteredCurrencies =
    target === "to"
      ? selectableCurrencies.filter(c => c !== exchange.fromCurrency)
      : selectableCurrencies;
  const sortedCryptoCurrencies = useCurrenciesByMarketcap(
    maybeFilteredCurrencies,
  );
  const clearBadSelection = useCallback(() => setBadSelection(null), [
    setBadSelection,
  ]);

  const onPressItem = useCallback(
    (currencyOrToken: CryptoCurrency | TokenCurrency) => {
      const status = currenciesStatus[currencyOrToken.id];
      if (status === "ok") {
        if (target === "from") {
          navigation.navigate(ScreenName.SwapFormSelectAccount, {
            exchange: {
              ...exchange,
              fromCurrency: currencyOrToken,
              fromAccount: null,
              toCurrency: null,
              toAccount: null,
            },
            target,
          });
        } else {
          navigation.navigate(ScreenName.SwapFormSelectAccount, {
            exchange: {
              ...exchange,
              toCurrency: currencyOrToken,
              toAccount: null,
            },
            target,
          });
        }
      } else {
        setBadSelection({ status, currency: currencyOrToken });
      }
    },
    [currenciesStatus, exchange, navigation, target],
  );

  const renderList = items => (
    <FlatList
      contentContainerStyle={styles.list}
      data={items}
      renderItem={({ item }) => (
        <CurrencyRow
          status={currenciesStatus[item.id]}
          currency={item}
          onPress={onPressItem}
        />
      )}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
    />
  );

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="AddAccounts" name="SelectCrypto" />
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
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
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
