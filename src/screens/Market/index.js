import React, { useEffect, useMemo, useState, useRef } from "react";
import { ActivityIndicator, StyleSheet, Image, TouchableOpacity, Text, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import InfiniteScroll from "react-native-infinite-scrolling";
import {
  listTokens,
  useCurrenciesByMarketcap,
  listSupportedCurrencies,
} from "@ledgerhq/live-common/lib/currencies";
import KeyboardView from "../../components/KeyboardView";
import CurrencyRow from "../../components/CurrencyInfoRow";
import { MarketClient } from "../../api/market";
import BottomSelectSheetFilter from "./BottomSelectSheetFilter";
import BottomSelectSheetTF from "./BottomSelectSheetTF";
import FilterIcon from "../../images/filter.png";
import SearchBox from "./SearchBox";
import DownArrow from "../../icons/DownArrow";
import { filter } from "lodash";


type Props = {
  navigation: Object,
};

const CHANGE_TIMES = [
  { name: "1 day", display: "Last 24 hours", key: "24h" },
  { name: "1 week", display: "Last 1 week", key: "7d" },
  { name: "1 month", display: "Last 1 month", key: "30d" },
  { name: "1 year", display: "Last 1 year", key: "1y" },
];

const SHOW_OPTION_ALL = "All";
const SHOW_OPTION_LEDGER = "Ledger Live compatible";
const SHOW_OPTION_STARRED = "Starred coins";

const SHOW_OPTIONS = [
  { name: SHOW_OPTION_ALL },
  { name: SHOW_OPTION_LEDGER },
  { name: SHOW_OPTION_STARRED },
];

const SORT_OPTIONS = [
  { name: "Rank" },
  { name: "Name A-Z" },
  { name: "Name Z-A" },
];

const getCurrencyData = async (limit, page, sortOption) => {
  const marketClient = new MarketClient();
  const orderBy = sortOption === "Rank" ? "market_cap" : "id";
  const order = sortOption === "Name A-Z" ? "asc" : "desc";
  const responses = await marketClient.getCurrencyData({
    limit,
    page,
    counterCurrency: "usd",
    range: "24h,7d,30d,1y",
    order,
    orderBy,
  });
  return responses.filter(response => response.id).map(response => ({
    id: response.id,
    name: response.name || response.id,
    ticker: (response.symbol || response.id).toUpperCase(),
    data: response,
  }));
};

export default function Market({ navigation }: Props) {
  const [currencies, setCurrencies] = useState([]);
  const [range, setRange] = useState("24h");
  const [showOption, setShowOption] = useState(SHOW_OPTION_ALL);
  const [sortOption, setSortOption] = useState("Rank");
  const [timeframe, setTimeframe] = useState(CHANGE_TIMES[0]);
  const [activePage, setActivePage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const RBSheetTimeFrame = useRef();
  const RBSheetFilter = useRef();
  useEffect(() => {
    loadMore();
  }, [sortOption, showOption]);

  const ledgerCurrencies = useMemo(
    () => listSupportedCurrencies().map(coin => coin.ticker),
    [],
  );

  const onPressItem = currencyOrToken => {
    navigation.navigate("SymbolDashboard", {
      currencyOrToken,
    });
  };

  const onClickTimeFrame = () => {
    RBSheetTimeFrame.current.open();
  };

  const onClickFilter = () => {
    RBSheetFilter.current.open();
  };

  const onApplyTF = activeItem => {
    setTimeframe(activeItem);
    RBSheetTimeFrame.current.close();
    setRange(activeItem.key);
  };

  const onApplyFilter = _filterOptions => {
    setActivePage(1);
    setCurrencies([]);
    setShowOption(_filterOptions[0].active);
    setSortOption(_filterOptions[1].active);
    RBSheetFilter.current.close();
  };

  const loadMore = () => {
    if (activePage > 20) return;
    (async () => {
      setLoadingMore(true);
      const currencyData = await getCurrencyData(10, activePage, sortOption);
      const nxt = activePage + 1;
      setActivePage(nxt);
      setCurrencies(currencies.concat(currencyData));
      setLoadingMore(false);
    })();
  }

  const filtered = (item) => {
    if (showOption === SHOW_OPTION_LEDGER) {
      return ledgerCurrencies.includes(item.ticker);
    }
    if (showOption === SHOW_OPTION_STARRED) {
      return true;
    }
    return true;
  }

  const renderData = ({item}) => {
    return filtered(item) ? (
      <CurrencyRow
        currency={item}
        onPress={onPressItem}
        range={range}
      />
    ) : (<></>)
  }

  const LoadingMore = () => {
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size={"small"} color={"#d4d4d4"} />
      </View>
    )
  }

  return (
    <>
      <KeyboardView style={styles.root}>
        <View style={styles.headerFilter}>
          <View style={styles.searchContainer}>
            <SearchBox />
          </View>
          <View>
            <TouchableOpacity style={styles.filterBtn} onPress={onClickFilter}>
              <Image source={FilterIcon} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tfSelector}>
          <Text style={styles.tf}>Timeframe</Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={onClickTimeFrame}
          >
            <Text style={styles.tfItem}>
              {"  "}
              {timeframe.display}{" "}
            </Text>
            <DownArrow color={"#6490f1"} width={"12"} height={"8"}/>
          </TouchableOpacity>
        </View>
        
        <InfiniteScroll
          renderData={renderData}
          data={currencies}
          loadMore={loadMore}
        />

        {loadingMore && <LoadingMore />}

        <RBSheet
          ref={RBSheetFilter}
          height={450}
          openDuration={250}
          closeOnDragDown
          customStyles={{
            container: {
              backgroundColor: "#ffffff",
              borderRadius: 20,
            },
            draggableIcon: {
              backgroundColor: "#14253320",
              width: 0,
            },
            wrapper: {
              color: "#142533",
              fontFamily: "Inter",
            },
          }}
        >
          <BottomSelectSheetFilter
            filterOptions={[
              { title: "SHOW", options: SHOW_OPTIONS, active: showOption },
              { title: "SORT BY", options: SORT_OPTIONS, active: sortOption },
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
              borderRadius: 20,
            },
            draggableIcon: {
              backgroundColor: "#14253320",
              width: 40,
            },
            wrapper: {
              color: "#142533",
              fontFamily: "Inter",
            },
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
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flex: 1,
    paddingRight: 8,
  },
  headerFilter: {
    flexDirection: "row",
    paddingTop: 16,
  },
  tfSelector: {
    flexDirection: "row",
    paddingTop: 15,
  },
  tf: {
    fontSize: 15,
    color: "#14253360",
  },
  tfItem: {
    fontSize: 15,
    color: "#6490f1",
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: "#14253360",
    borderWidth: 1,
    justifyContent: "center",
  },
  filterIcon: {
    alignSelf: "center",
    width: "60%",
    height: "60%",
    marginBottom: 0,
  },
  loadingMore: {
    height: 40,
    paddingVertical: 6,
  },
});
