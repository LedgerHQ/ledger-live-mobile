import React, { useEffect, useRef, useState, useContext } from "react";
import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

import Animated from "react-native-reanimated";
import { createNativeWrapper } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import Chart from "./Chart";
import NotSupportedCryptocurrency from "./NotSupportedCryptocurrency";
import { accountsSelector } from "../../reducers/accounts";
import FabActions from "../../components/FabActions";
import InfoTable from "./InfoTable";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";
import { useScrollToTop } from "../../navigation/utils";
import {
  counterValueCurrencySelector,
  swapSelectableCurrenciesSelector,
} from "../../reducers/settings";

import { isCurrencySupported } from "../Exchange/coinifyConfig";

import {
  usePriceStatistics,
  useMarketCap,
  useSupply,
  useMarketCurrencyChart,
  useTimeRangeForChart,
  useSelectedTimeRangeForChart,
} from "../../hooks/market";

import { useRange } from "../../hooks/market/useRangeHook";

import {
  MarketContext,
  LOAD_CURRENCY_BY_ID,
  LOAD_CHART_DATA,
} from "../../context/MarketContext";

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

export default function SymbolDashboard({ route }: Props) {
  const { currencyOrToken } = route.params;
  const prefferedCurrency = useSelector(counterValueCurrencySelector);
  const { contextState, contextDispatch } = useContext(MarketContext);
  const [, , timeRangeItems] = useTimeRangeForChart();

  const savedRange = useSelectedTimeRangeForChart();

  const selectedRange = timeRangeItems.find(i => i.key === savedRange);

  const { colors } = useTheme();

  const [range, setRange] = useState(selectedRange);
  const accounts = useSelector(accountsSelector);
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    rangeData: { days, interval },
  } = useRange(range.value);

  const ref = useRef();
  useScrollToTop(ref);

  useEffect(() => {
    contextDispatch(LOAD_CURRENCY_BY_ID, {
      id: currencyOrToken.id,
      counterCurrency: prefferedCurrency.ticker,
      range,
    });
    contextDispatch(LOAD_CHART_DATA, {
      id: currencyOrToken.id,
      counterCurrency: prefferedCurrency.ticker,
      days,
      interval,
    });
  }, [currencyOrToken.id, days, interval, prefferedCurrency.ticker, range]);

  const { currencyChartData, chartLoading, currency, loading } = contextState;

  const { chartData } = useMarketCurrencyChart({
    prices: currencyChartData,
    interval,
    id: currencyOrToken.id,
  });

  const priceStat = usePriceStatistics(currency, prefferedCurrency);
  const marketCap = useMarketCap(currency, prefferedCurrency);
  const supply = useSupply(currency, prefferedCurrency);

  const availableOnSwap = useSelector(state =>
    swapSelectableCurrenciesSelector(state),
  );

  const canBeBought = isCurrencySupported(currency, "buy");

  const isAvailableOnSwap = availableOnSwap.includes(currency.id);

  const data = [
    <Chart
      chartData={chartData}
      loading={chartLoading}
      setRange={setRange}
      range={range}
      currency={currency}
      prefferedCurrency={prefferedCurrency}
      testID={"CoinChart"}
    />,
    ...(loading
      ? [<ActivityIndicator color={colors.grey} />]
      : [
          <>
            {!canBeBought && !isAvailableOnSwap ? (
              <NotSupportedCryptocurrency currency={currency} />
            ) : (
              <FabActions
                marketPage={true}
                canBeBought={canBeBought}
                isAvailableOnSwap={isAvailableOnSwap}
                currency={currency}
              />
            )}
          </>,
          <InfoTable title={"Price statistics"} rows={priceStat} />,
          <InfoTable title={"Market cap"} rows={marketCap} />,
          <InfoTable title={"Supply"} rows={supply} />,
        ]),
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
