import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import Animated from "react-native-reanimated";
import { createNativeWrapper } from "react-native-gesture-handler";
import moment from "moment";
import Chart from "./Chart";
import { accountsSelector } from "../../reducers/accounts";
import FabActions from "../../components/FabActions";
import InfoTable from "./InfoTable";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";
import { useScrollToTop } from "../../navigation/utils";
import { MarketClient } from "../../api/market";
import { useRange } from "./useRangeHook";
import { counterValueCurrencySelector } from "../../reducers/settings";

type Props = {
  navigation: any,
  route: any,
};

const currencyFormat = num =>
  "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const AnimatedFlatListWithRefreshControl = createNativeWrapper(
  Animated.createAnimatedComponent(globalSyncRefreshControl(FlatList)),
  {
    disallowInterruption: true,
    shouldCancelWhenOutside: false,
  },
);

const formattedHourTime = index =>
  moment()
    .startOf("hour")
    .subtract(index, "hours")
    .toDate();

const formattedDayTime = index =>
  moment()
    .subtract(index, "days")
    .toDate();

const formattedMinuteTime = index =>
  moment()
    .subtract(index * 5, "minutes")
    .toDate();

export default function SymbolDashboard({ route }: Props) {
  const { currencyOrToken } = route.params;
  const prefferedCurrency = useSelector(counterValueCurrencySelector);
  const accounts = useSelector(accountsSelector);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [chartData, setChartData] = useState([]);
  const [loading, selLoading] = useState(false);
  const [range, setRange] = useState({ key: "day", value: "1D", label: "1D" });
  const [priceStat, setPriceStat] = useState([]);
  const [marketCap, setMarketCap] = useState([]);
  const [supply, setSupply] = useState([]);
  const [currency, setCurrency] = useState({});

  const ref = useRef();
  useScrollToTop(ref);

  // CHECK SUPPORTED COINS
  // const cryptoCurrencies = useMemo(
  //   () => listSupportedCurrencies().concat(listTokens()),
  //   [],
  // );

  const buildChartData = ({ interval, prices }) => {
    if (!prices.length || !interval) return [];

    const data = [];
    for (let i = 0; i <= prices.length - 1; i++) {
      const price = prices[i];
      const formattedTime =
        interval === "hourly"
          ? formattedHourTime(i)
          : interval === "minutely"
          ? formattedMinuteTime(i)
          : formattedDayTime(i);
      data.push({ date: formattedTime, value: price });
    }
    return data;
  };

  const {
    rangeData: { days, interval },
  } = useRange(range.value);

  useEffect(() => {
    const marketClient = new MarketClient();
    selLoading(true);
    marketClient
      .currencyChartData({
        id: currencyOrToken.id,
        counterCurrency: prefferedCurrency.ticker,
        days,
        interval,
      })
      .then(prices => {
        const data = buildChartData({ interval, prices });
        setChartData(data);
        selLoading(false);
      });
    selLoading(true);
    marketClient
      .currencyById({
        id: currencyOrToken.id,
        counterCurrency: prefferedCurrency.ticker,
        range: "1h,24h,7d,30d,1y"
      })
      .then(currency => {
        setCurrency(currency);
        const priceStatistics = [
          {
            title: "Price",
            info: currencyFormat(currency.current_price),
            additionalInfo: {
              percentage: currency.market_cap_change_percentage_24h / 100,
            },
          },
          {
            title: "Trading volume (24h)",
            info: currencyFormat(currency.total_volume),
          },
          {
            title: "24h Low / 24h High",
            info: `${currencyFormat(currency.low_24h)} / ${currencyFormat(
              currency.high_24h,
            )}`,
          },
          {
            title: "7d Low / 7d High",
            info: `${currencyFormat(
              currency.sparkline_in_7d.price[0],
            )} / ${currencyFormat(
              currency.sparkline_in_7d.price[currency.sparkline_in_7d.price.length - 1],
            )}`,
          },
          {
            title: "All time high",
            info: `${currencyFormat(currency.ath)}`,
            date: moment(currency.ath_date).format("LL"),
          },
          {
            title: "All time low",
            info: `${currencyFormat(currency.atl)}`,
            date: moment(currency.atl_date).format("LL"),
          },
        ];
        setPriceStat(priceStatistics);
        const marketCap = [
          {
            title: "Market cap",
            info: `${currencyFormat(currency.market_cap)}`,
          },
          {
            title: "Market cap rank",
            info: `${currency.market_cap_rank}`,
          },
        ];
        setMarketCap(marketCap);
        const supply = [
          {
            title: "Circulating supply",
            info: `${currencyFormat(currency.circulating_supply)}`,
          },
          {
            title: "Total supply",
            info: `${currencyFormat(currency.total_supply)}`,
          },
          {
            title: "Max supply",
            info: `${currencyFormat(currency.max_supply)}`,
          },
        ];
        setSupply(supply);
        selLoading(false);
      });
  }, [currencyOrToken, days, interval, prefferedCurrency]);

  const data = [
    <Chart
      chartData={chartData}
      loading={loading}
      setRange={setRange}
      currency={currency}
    />,
    <FabActions marketPage />,
    <InfoTable title={"Price statistics"} rows={priceStat} />,
    <InfoTable title={"Market cap"} rows={marketCap} />,
    <InfoTable title={"Supply"} rows={supply} />,
  ];
  return (
    <AnimatedFlatListWithRefreshControl
      ref={ref}
      data={data}
      style={styles.inner}
      renderItem={({ item }) => item}
      keyExtractor={(item, index) => String(index)}
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: scrollY },
            },
          },
        ],
        { useNativeDriver: true },
      )}
      testID={
        accounts.length ? "PortfolioAccountsList" : "PortfolioEmptyAccount"
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    backgroundColor: "#fff",
  },
  stickyActions: {
    height: 40,
    width: "100%",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  styckyActionsInner: { height: 56 },
});
