import React, { useMemo, useEffect, useState, useRef } from "react";
import { StyleSheet, FlatList, Image, TouchableOpacity, Text, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  listTokens,
  useCurrenciesByMarketcap,
  listSupportedCurrencies,
} from "@ledgerhq/live-common/lib/currencies";
import FilteredSearchBarBody from "../../components/FilteredSearchBarBody";
import KeyboardView from "../../components/KeyboardView";
import CurrencyRow from "../../components/CurrencyInfoRow";
import { MarketClient } from "../../api/market";
import BottomSelectSheetFilter from "./BottomSelectSheetFilter";
import BottomSelectSheetTF from "./BottomSelectSheetTF";
import FilterIcon from "../../images/filter.png";
import SearchBox from "./SearchBox";
import PaginationBar from "../../components/PaginationBar";

const SEARCH_KEYS = ["name", "ticker"];

const CHANGE_TIMES = [
  { name: "1 day", display: "Last 24 hours", key: "24h" },
  { name: "1 week", display: "Last 1 week", key: "7d" },
  { name: "1 month", display: "Last 1 month", key: "30d" },
  { name: "1 year", display: "Last 1 year", key: "1y" }
];

const SHOW_OPTIONS = [
  { name: "All" },
  { name: "Ledger Live compatible" },
  { name: "Starred coins" }
];

const SORT_OPTIONS = [
  { name: "Rank" },
  { name: "Name A-Z" },
  { name: "Name Z-A" },
];

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

const CONST_INDEX_ARRAY = (size) => {
  return Array.from(Array(size+1).keys()).slice(1).map(id => {
    return {index: id - 1}
  });
}

export default function MainScreen({ navigation }: Props) {
  const [currencies, setCurrencies] = useState([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [range, setRange] = useState("24h");
  const [showOption, setShowOption] = useState("All");
  const [sortOption, setSortOption] = useState("Rank");
  const [timeframe, setTimeframe] = useState(CHANGE_TIMES[0]);
  const [activePage, setActivePage] = useState(1);
  const RBSheetTimeFrame = useRef();
  const RBSheetFilter = useRef();
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

  const onClickTimeFrame = () => {
    RBSheetTimeFrame.current.open();
  };

  const onClickFilter = () => {
    RBSheetFilter.current.open();
  }

  const onApplyTF = (activeItem) => {
    setTimeframe(activeItem);
    RBSheetTimeFrame.current.close();
    setRange(activeItem.key);
  }

  const onApplyFilter = (_filterOptions) => {
    setShowOption(_filterOptions[0].active);
    setSortOption(_filterOptions[1].active);
    RBSheetFilter.current.close();
  }

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
        <View flexDirection={"row"} paddingTop={16}>
          <View style={styles.searchContainer}>
            {/* <FilteredSearchBarBody
              keys={SEARCH_KEYS}
              inputWrapperStyle={styles.filteredSearchInputWrapperStyle}
              list={currencies}
              renderList={renderList}
              renderEmptySearch={renderEmptyList}
              setRange={setRange}
            /> */}
            <SearchBox />
          </View>
          <View>
            <TouchableOpacity style={styles.filterBtn} onPress={onClickFilter}>
              <Image source={FilterIcon} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tfSelector}>
          <Text style={styles.tf}>
            Timeframe
          </Text>
          <TouchableOpacity style={{flexDirection: "row"}} onPress={onClickTimeFrame}>
            <Text style={styles.tfItem}>
              {"  "}{timeframe.display}{" "}
            </Text>
            <Text style={styles.tfIcon}>
              {" ˅ "}
            </Text>
          </TouchableOpacity>
        </View>

        <PaginationBar
          totalPages={10}
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <RBSheet
          ref={RBSheetFilter}
          height={450}
          openDuration={250}
          closeOnDragDown
          customStyles={{
            container: {
              backgroundColor: "#ffffff",
              borderRadius: 20
            },
            draggableIcon: {
              backgroundColor: "#14253320",
              width: 0
            },
            wrapper: {
              color: "#142533",
              fontFamily: "Inter"
            }
          }}
        >
          <BottomSelectSheetFilter 
            filterOptions={[
              { title: "SHOW", options: SHOW_OPTIONS, active: showOption },
              { title: "SORT BY", options: SORT_OPTIONS, active: sortOption }
            ]}
            onApply={onApplyFilter}
          />
        </RBSheet>
        <RBSheet
          ref={RBSheetTimeFrame}
          height={350}
          openDuration={250}
          closeOnDragDown
          customStyles={{
            container: {
              backgroundColor: "#ffffff",
              borderRadius: 20
            },
            draggableIcon: {
              backgroundColor: "#14253320",
              width: 40
            },
            wrapper: {
              color: "#142533",
              fontFamily: "Inter"
            }
          }}
        >
          <BottomSelectSheetTF
            title={"Timeframe"}
            options={CHANGE_TIMES}
            active={timeframe}
            onApply={onApplyTF}
          />
        </RBSheet>
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
    flex: 1
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
  tfSelector: {
    flexDirection: "row",
    paddingTop: 15
  },
  tf: {
    fontSize: 15,
    paddingLeft: 15
  },
  tfItem: {
    fontSize: 15,
    color: "#6490f1"
  },
  tfIcon: {
    fontSize: 20,
    color: "#6490f1",
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: "#14253350",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    right: 15,
    marginLeft: 5
  },
  filterIcon: {
    alignSelf: "center",
    width: "60%",
    height: "60%",
    marginBottom: 0
  },
  pageNumber: {
    fontSize: 20
  }
});
