import React from "react";
import { MarketClient } from "../api/market";

const marketClient = new MarketClient();

export const SET_CURRENCY = "SET_CURRENCY";
export const SET_CURRENCY_CHART_DATA = "SET_CURRENCY_CHART_DATA";
export const MARKET_SET_SELECTED_TIME_RANGE = "MARKET_SET_SELECTED_TIME_RANGE";
export const SET_FAVORITE_CRYPTOCURRENCIES = "SET_FAVORITE_CRYPTOCURRENCIES";
export const LOAD_CURRENCY_BY_ID = "LOAD_CURRENCY_BY_ID";
export const LOAD_CHART_DATA = "LOAD_CHART_DATA";
export const SET_CHART_LOADING = "SET_CHART_LOADING";
export const SET_LOADING = "SET_LOADING";

export const MarketContext = React.createContext();

const handlers = {
  LOAD_CURRENCY_BY_ID: async ({ action, dispatch }) => {
    dispatch(SET_CHART_LOADING, { chartLoading: true });

    const { id, counterCurrency, range } = action.payload;
    const currency = await marketClient.currencyById({
      id: id || "",
      counterCurrency,
      range,
    });

    dispatch(SET_CURRENCY, { currency });
    dispatch(SET_CHART_LOADING, { chartLoading: false });
  },
  LOAD_CHART_DATA: async ({ action, dispatch }) => {
    dispatch(SET_LOADING, { loading: true });

    const { id, counterCurrency, days, interval } = action.payload;
    const chartData = await marketClient.currencyChartData({
      id,
      counterCurrency,
      days,
      interval,
    });

    dispatch(SET_CURRENCY_CHART_DATA, { currencyChartData: chartData });
    dispatch(SET_LOADING, { loading: false });
  },
};

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
  favoriteCryptocurrencies: Array<string>,
  selectedTimeRange: string,
};

function marketReducer(state, action) {
  switch (action.type) {
    case SET_CURRENCY: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case SET_CURRENCY_CHART_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case MARKET_SET_SELECTED_TIME_RANGE: {
      return {
        ...state,
        selectedTimeRange: action.payload,
      };
    }
    case SET_FAVORITE_CRYPTOCURRENCIES: {
      return {
        ...state,
        favoriteCryptocurrencies: action.payload,
      };
    }
    case SET_CHART_LOADING: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

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
  selectedTimeRange: "day",
  currencyChartData: [],
  favoriteCryptocurrencies: [],
  chartLoading: false,
  loading: false,
};

export function MarketProvider({ children }: { children: React.Node }) {
  const [state, setState] = React.useReducer(marketReducer, initialState);

  const dispatch = async (type, payload = {}): void => {
    if (handlers[type]) {
      await handlers[type]({
        dispatch,
        state,
        action: { type, payload },
      });
    } else {
      setState({ type, payload });
    }
  };
  const value = { contextState: state, contextDispatch: dispatch };
  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
}
