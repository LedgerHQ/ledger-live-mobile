import type { ThunkAction } from "redux-thunk";
import { MarketClient } from "../api/market";

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
  };

export const setFavoriteCryptocurrencies = (
  favoriteCurrencies: Array<string>,
) => ({
  type: "SET_FAVORITE_CRYPTOCURRENCIES",
  favoriteCurrencies,
});
