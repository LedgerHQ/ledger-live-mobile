import React, { useRef, useEffect, useState, useMemo } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  listSupportedCurrencies,
  // listTokens,
} from "@ledgerhq/live-common/lib/currencies";
import Animated from "react-native-reanimated";
import { createNativeWrapper } from "react-native-gesture-handler";
import moment from "moment";
import Chart from "./Chart";
import NotSupportedCryptocurrency from "./NotSupportedCryptocurrency";
import { accountsSelector } from "../../reducers/accounts";
import FabActions from "../../components/FabActions";
import InfoTable from "./InfoTable";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";
import { useScrollToTop } from "../../navigation/utils";
import { useRange } from "./useRangeHook";
import { counterValueCurrencySelector } from "../../reducers/settings";
import { loadCurrencyById, loadCurrencyChartData } from "../../actions/market";
import {
  selectedCurrencySelector,
  priceStatisticsSelector,
  marketCapSelector,
  supplySelector,
  currencyChartDataSelector,
} from "../../reducers/market";

type Props = {
  navigation: any,
  route: any,
};

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
  // console.log(currencyOrToken);
  const prefferedCurrency = useSelector(counterValueCurrencySelector);
  const priceStat = useSelector(priceStatisticsSelector);
  const marketCap = useSelector(marketCapSelector);
  const supply = useSelector(supplySelector);
  const prices = useSelector(currencyChartDataSelector);
  const accounts = useSelector(accountsSelector);
  const currency = useSelector(selectedCurrencySelector);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [range, setRange] = useState({ key: "day", value: "1D", label: "1D" });
  const [loading, setLoading] = useState(false);

  const ref = useRef();
  useScrollToTop(ref);

  // SUPPORTED COINS
  const supportedCryptoCurrencies = useMemo(
    () => listSupportedCurrencies(),
    [],
  );

  // const supportedCryptoCurrencies = useMemo(
  //   () => listSupportedCurrencies().concat(listTokens()),
  //   [],
  // );

  // CHECK SUPPROT BUY AND SWAP
  const checkSupport = supportedCryptoCurrencies.filter(
    cur => cur.ticker.toLowerCase() === currency.symbol,
  );

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

  const chartData = buildChartData({ interval, prices });

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(
      loadCurrencyById({
        id: currencyOrToken.id,
        counterCurrency: prefferedCurrency.ticker,
        range: "1h,24h,7d,30d,1y",
      }),
    );
    dispatch(
      loadCurrencyChartData({
        id: currencyOrToken.id,
        counterCurrency: prefferedCurrency.ticker,
        days,
        interval,
      }),
    );
    setLoading(false);
  }, [currencyOrToken, days, dispatch, interval, prefferedCurrency]);

  const data = [
    <Chart
      chartData={chartData}
      loading={loading}
      setRange={setRange}
      currency={currency}
      prefferedCurrency={prefferedCurrency}
      testID={"CoinChart"}
    />,
    <>
      {checkSupport.length ? (
        <FabActions marketPage />
      ) : (
        <NotSupportedCryptocurrency />
      )}
    </>,
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
