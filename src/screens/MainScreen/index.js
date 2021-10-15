import React, { useMemo } from "react";
import { StyleSheet, FlatList, Text, View } from "react-native";
import {
  listTokens,
  useCurrenciesByMarketcap,
  listSupportedCurrencies,
} from "@ledgerhq/live-common/lib/currencies";
import FilteredSearchBarBody from "../../components/FilteredSearchBarBody";
import KeyboardView from "../../components/KeyboardView";
import CurrencyRow from "../../components/CurrencyInfoRow";

const SEARCH_KEYS = ["name", "ticker"];

type Props = {
  navigation: any,
};

const keyExtractor = currency => currency.id;

const renderEmptyList = () => (
  <View style={styles.emptySearch}>
    <LText style={styles.emptySearchText}>
      <Trans i18nKey="common.noCryptoFound" />
    </LText>
  </View>
);

const generateMockData = (currencies) => {
  currencies.forEach((currency, rank) => {
    currency["rank"] = rank + 1;
    if (currency["ticker"] === "BTC") {
      currency["totalAsset"] = 447250000000;
      currency["changePercent"] = 0.0234;
      currency["price"] = 55540.54;
      currency["favourite"] = true;
    }
    else if (currency["ticker"] === "ETH") {
      currency["totalAsset"] = 1447000000;
      currency["changePercent"] = 0.0125;
      currency["price"] = 3301.24;
      currency["favourite"] = true;
    }
    else {
      currency["totalAsset"] = 447000000;
      currency["changePercent"] = -0.0079;
      currency["price"] = 40.54;
      currency["favourite"] = false;
    }
  });
  return currencies;
}

export default function MainScreen({ navigation }: Props) {
  const cryptoCurrencies = useMemo(
    () => listSupportedCurrencies().concat(listTokens()),
    [],
  );

  const sortedCryptoCurrencies = useCurrenciesByMarketcap(cryptoCurrencies);
  const sortedCryptoCurrenciesMock = generateMockData(sortedCryptoCurrencies);

  const onPressItem = (currencyOrToken) => {
    navigation.navigate("SymbolDashboard", {
      currencyOrToken: currencyOrToken
    });
  };

  const renderList = items => (
    <FlatList
      contentContainerStyle={styles.list}
      data={items}
      renderItem={({ item }) => (
        <CurrencyRow currency={item} onPress={onPressItem} />
      )}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
    />
  );

  return (
    <>
      <KeyboardView style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <FilteredSearchBarBody
            keys={SEARCH_KEYS}
            inputWrapperStyle={styles.filteredSearchInputWrapperStyle}
            list={sortedCryptoCurrencies}
            renderList={renderList}
            renderEmptySearch={renderEmptyList}
          />
        </View>
      </KeyboardView>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
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
