import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet, FlatList, Text, View } from "react-native";
import {
  listTokens,
  useCurrenciesByMarketcap,
  listSupportedCurrencies,
} from "@ledgerhq/live-common/lib/currencies";
import FilteredSearchBarBody from "../../components/FilteredSearchBarBody";
import KeyboardView from "../../components/KeyboardView";
import CurrencyRow from "../../components/CurrencyInfoRow";
import { MarketClient } from "../../api/market";

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

const generateData = async (currencies) => {
  const marketClient = new MarketClient();
  const responses = await marketClient
    .currencyByIds({
      ids: currencies.map(item => item.id), 
      counterCurrency: "usd", 
      range: "24h,7d,30d,1y"
    });
  responses.forEach((rsp, id) => {
    currencies.forEach(currency => {
      if (rsp.id === currency.id) {
        currency.data = rsp;
      }
    });
  });
  return currencies;
}

export default function MainScreen({ navigation }: Props) {
  const [currencies, setCurrencies] = useState([]);
  const [range, setRange] = useState("24h");
  useEffect(() => {
    (async () => {
      const cryptoCurrencies = listSupportedCurrencies().concat(listTokens());
      const sortedCryptoCurrencies = cryptoCurrencies.slice(0, 20);
      await generateData(sortedCryptoCurrencies);
      setCurrencies(sortedCryptoCurrencies);
    })();
  }, []);

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
        <CurrencyRow currency={item} onPress={onPressItem} range={range} />
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
            list={currencies}
            renderList={renderList}
            renderEmptySearch={renderEmptyList}
            setRange={setRange}
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
