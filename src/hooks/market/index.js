import { useCallback, useContext, useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  MarketContext,
  MARKET_SET_SELECTED_TIME_RANGE,
  SET_FAVORITE_CRYPTOCURRENCIES,
} from "../../context/MarketContext";
import { currencyFormat } from "../../helpers/currencyFormatter";
import {
  getRangeForChart,
  getFavoriteCurrencies,
  setRangeForChart as setRangeForChartDB,
} from "../../db";

export const useMarketRoot = () => {
  const { contextState } = useContext(MarketContext);
  return contextState;
};

export const usePriceStatistics = (currency, prefferedCurrency) => [
  {
    title: "Price",
    info: currencyFormat(currency.current_price, prefferedCurrency.symbol),
    additionalInfo: {
      percentage: currency.market_cap_change_percentage_24h / 100,
    },
  },
  {
    title: "Trading volume (24h)",
    info: currencyFormat(currency.total_volume, prefferedCurrency.symbol),
  },
  {
    title: "24h Low / 24h High",
    info: `${currencyFormat(
      currency.low_24h,
      prefferedCurrency.symbol,
    )} / ${currencyFormat(currency.high_24h, prefferedCurrency.symbol)}`,
  },
  {
    title: "7d Low / 7d High",
    info: `${currencyFormat(
      currency.sparkline_in_7d.price[0],
      prefferedCurrency.symbol,
    )} / ${currencyFormat(
      currency.sparkline_in_7d.price[currency.sparkline_in_7d.price.length - 1],
      prefferedCurrency.symbol,
    )}`,
  },
  {
    title: "All time high",
    info: `${currencyFormat(currency.ath, prefferedCurrency.symbol)}`,
    date: moment(currency.ath_date).format("LL"),
  },
  {
    title: "All time low",
    info: `${currencyFormat(currency.atl, prefferedCurrency.symbol)}`,
    date: moment(currency.atl_date).format("LL"),
  },
];

export const useMarketCap = (currency, prefferedCurrency) => [
  {
    title: "Market cap",
    info: `${currencyFormat(currency.market_cap, prefferedCurrency.symbol)}`,
  },
  {
    title: "Market cap rank",
    info: `${currency.market_cap_rank}`,
  },
];

export const useSupply = (currency, prefferedCurrency) => [
  {
    title: "Circulating supply",
    info: `${currencyFormat(
      currency.circulating_supply,
      prefferedCurrency.symbol,
    )}`,
  },
  {
    title: "Total supply",
    info: `${currencyFormat(currency.total_supply, prefferedCurrency.symbol)}`,
  },
  {
    title: "Max supply",
    info: `${currencyFormat(currency.max_supply, prefferedCurrency.symbol)}`,
  },
];

export const useSelectedTimeRangeForChart = () => {
  const market = useMarketRoot();
  return market.selectedTimeRange;
};

export const useFavoriteCrypto = () => {
  const market = useMarketRoot();
  return market.favoriteCryptocurrencies;
};
export const useMarketCurrencyChart = ({ interval, prices, id }) => {
  const [chartData, setChartData] = useState([]);

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

  useEffect(() => {
    const buildChartData = () => {
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

    const chart = buildChartData();

    setChartData(chart);
  }, [interval, prices.length, id, prices]);

  return { chartData };
};

export const useMarketContextUpdate = () => {
  const { contextDispatch } = useContext(MarketContext);
  useEffect(() => {
    setFavorite();
    setTimeRange();
  }, [setFavorite, setTimeRange]);

  const setFavorite = useCallback(async () => {
    const favoriteCurrencies = await getFavoriteCurrencies();
    if (favoriteCurrencies) {
      contextDispatch(
        SET_FAVORITE_CRYPTOCURRENCIES,
        Object.values(favoriteCurrencies),
      );
    }
  }, [contextDispatch]);

  const setTimeRange = useCallback(async () => {
    const rangeForChart = await getRangeForChart();
    if (rangeForChart) {
      contextDispatch(MARKET_SET_SELECTED_TIME_RANGE, rangeForChart);
    }
  }, [contextDispatch]);
};

type MarketRange = "hour" | "day" | "week" | "month" | "year" | "all";
type MarketRangeOption = {
  key: MarketRange,
  value: string,
  label: string,
};

export const useTimeRangeForChart = () => {
  const { t } = useTranslation();
  const { contextDispatch } = useContext(MarketContext);
  const val = useSelectedTimeRangeForChart();
  const setter = useCallback(
    (_range: MarketRange | MarketRangeOption) => {
      const range = typeof _range === "string" ? _range : _range.key;
      contextDispatch(MARKET_SET_SELECTED_TIME_RANGE, range);
      setRangeForChartDB(range);
    },
    [contextDispatch],
  );
  const ranges: MarketRange[] = ["hour", "day", "week", "month", "year", "all"];
  const options = ranges.map(key => ({
    key,
    value: t(`common:time.${key}`),
    label: t(`common:time.${key}`),
  }));
  return [val, setter, options];
};
