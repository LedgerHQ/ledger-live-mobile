import type { ThunkAction } from "redux-thunk";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { MarketClient } from "../api/market";
import { getTimeRangeForChartSelector } from "../reducers/market";
import {
  setRangeForChart as setRangeForChartDB,
  setFavoriteCurrencies as setFavoriteCurrenciesDB,
} from "../db";

type LoadCurrencyByID = {
  id: string,
  counterCurrency: string,
  range: ?string,
};

type LoadCurrencyChartData = {
  id: string,
  counterCurrency: string,
  days: string,
  interval: string,
};

const marketClient = new MarketClient();

export const loadCurrencyById: ThunkAction = (currencyData: LoadCurrencyByID) =>
  async function(dispatch) {
    const currency = await marketClient.currencyById(currencyData);

    dispatch(setCurrency(currency));
  };

export const setCurrency = payload => ({
  type: "SET_CURRENCY",
  payload,
});

export const loadCurrencyChartData: ThunkAction = (
  currencyData: LoadCurrencyChartData,
) =>
  async function(dispatch) {
    const currencyChart = await marketClient.currencyChartData(currencyData);

    dispatch(setCurrencyChartData(currencyChart));
  };

export const setCurrencyChartData = (payload: LoadCurrencyChartData) => ({
  type: "SET_CURRENCY_CHART_DATA",
  payload,
});

export const updateFavoriteCryptocurrencies = (
  favoriteCryptocurrencies: Array<string>,
) =>
  async function(dispatch) {
    dispatch(setFavoriteCryptocurrencies(favoriteCryptocurrencies));
    setFavoriteCurrenciesDB(favoriteCryptocurrencies);
  };

export const setFavoriteCryptocurrencies = (
  favoriteCurrencies: Array<string>,
) => ({
  type: "SET_FAVORITE_CRYPTOCURRENCIES",
  favoriteCurrencies,
});

export const setSelectedTimeRangeForChart = (selectedTimeRange: string) => ({
  type: "MARKET_SET_SELECTED_TIME_RANGE",
  payload: selectedTimeRange,
});

type MarketRange = "hour" | "day" | "week" | "month" | "year" | "all";
type MarketRangeOption = {
  key: MarketRange,
  value: string,
  label: string,
};

export function useTimeRangeForChart() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const val = useSelector(getTimeRangeForChartSelector);
  const setter = useCallback(
    (_range: MarketRange | MarketRangeOption) => {
      const range = typeof _range === "string" ? _range : _range.key;
      dispatch(setSelectedTimeRangeForChart(range));
      setRangeForChartDB(range);
    },
    [dispatch],
  );
  const ranges: MarketRange[] = ["hour", "day", "week", "month", "year", "all"];
  const options = ranges.map(key => ({
    key,
    value: t(`common:time.${key}`),
    label: t(`common:time.${key}`),
  }));
  return [val, setter, options];
}
