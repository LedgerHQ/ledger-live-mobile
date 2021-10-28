// @flow
/* eslint import/no-cycle: 0 */
import { handleActions } from "redux-actions";
import { createSelector } from "reselect";
import moment from "moment";
import type { State } from ".";
import { counterValueCurrencySelector } from "./settings";
import { currencyFormat } from "../helpers/currencyFormatter";

export type Sparkline7d = {
  price: Array<number>,
};
export type Currency = {
  ath: number,
  ath_date: string,
  atl: number,
  atl_date: string,
  circulating_supply: number,
  current_price: number,
  high_24h: number,
  id: string,
  image: string,
  low_24h: number,
  market_cap: number,
  market_cap_change_percentage_24h: any,
  market_cap_rank: number,
  max_supply: number,
  name: string,
  price_change_percentage_in_currency: number,
  sparkline_in_7d: Sparkline7d,
  symbol: string,
  total_supply: number,
  total_volume: number,
};

export type MarketState = {
  currency: Currency,
  currencyChartData: Array<number>,
};

const initialState: MarketState = {
  currency: {
    ath: 1,
    ath_date: "",
    atl: 1,
    atl_date: "",
    circulating_supply: 1,
    current_price: 1,
    high_24h: 1,
    id: "",
    image: "",
    low_24h: 1,
    market_cap: 1,
    market_cap_change_percentage_24h: "",
    market_cap_rank: 1,
    max_supply: 1,
    name: "",
    price_change_percentage_in_currency: 1,
    sparkline_in_7d: {
      price: [],
    },
    symbol: "",
    total_supply: 1,
    total_volume: 1,
  },
  currencyChartData: [],
};

const handlers: Object = {
  SET_CURRENCY: (state: any, { payload }: { payload: any }) => ({
    ...state,
    currency: payload,
  }),
  SET_CURRENCY_CHART_DATA: (state: any, { payload }: { payload: any }) => ({
    ...state,
    currencyChartData: payload,
  }),
};

// Selectors

export const marketRootSelector = (state: State) => state.market;

// $FlowFixMe
export const selectedCurrencySelector = createSelector(
  marketRootSelector,
  root => root.currency,
);

// $FlowFixMe
export const priceStatisticsSelector = createSelector(
  selectedCurrencySelector,
  counterValueCurrencySelector,
  (currency, prefferedCurrency) => {
    const priceStatistics = [
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
          currency.sparkline_in_7d.price[
            currency.sparkline_in_7d.price.length - 1
          ],
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
    return priceStatistics;
  },
);

// $FlowFixMe
export const marketCapSelector = createSelector(
  selectedCurrencySelector,
  counterValueCurrencySelector,
  (currency, prefferedCurrency) => {
    const marketCap = [
      {
        title: "Market cap",
        info: `${currencyFormat(
          currency.market_cap,
          prefferedCurrency.symbol,
        )}`,
      },
      {
        title: "Market cap rank",
        info: `${currency.market_cap_rank}`,
      },
    ];
    return marketCap;
  },
);

// $FlowFixMe
export const supplySelector = createSelector(
  selectedCurrencySelector,
  counterValueCurrencySelector,
  (currency, prefferedCurrency) => {
    const supply = [
      {
        title: "Circulating supply",
        info: `${currencyFormat(
          currency.circulating_supply,
          prefferedCurrency.symbol,
        )}`,
      },
      {
        title: "Total supply",
        info: `${currencyFormat(
          currency.total_supply,
          prefferedCurrency.symbol,
        )}`,
      },
      {
        title: "Max supply",
        info: `${currencyFormat(
          currency.max_supply,
          prefferedCurrency.symbol,
        )}`,
      },
    ];
    return supply;
  },
);

// $FlowFixMe
export const currencyChartDataSelector = createSelector(
  marketRootSelector,
  root => root.currencyChartData,
);

export default handleActions(handlers, initialState);
