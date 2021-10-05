import React, { useMemo } from "react";
import { StyleSheet, FlatList, Text, View } from "react-native";
import {
  listTokens,
  useCurrenciesByMarketcap,
  listSupportedCurrencies,
} from "@ledgerhq/live-common/lib/currencies";
import FilteredSearchBar from "../../components/FilteredSearchBar";
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

export default function MainScreen({ navigation }: Props) {
  const cryptoCurrencies = useMemo(
    () => listSupportedCurrencies().concat(listTokens()),
    [],
  );

  const sortedCryptoCurrencies = useCurrenciesByMarketcap(cryptoCurrencies);

  const onPressItem = (currencyOrToken) => {
    navigation.navigate("SymbolDashboard", {
      navigation, currencyOrToken
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
      <Text style={styles.header}>MARKET</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  header: {
    fontSize: 28
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
