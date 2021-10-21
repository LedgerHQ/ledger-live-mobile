import type { Currency } from "@ledgerhq/live-common/lib/types";

export type MarketCurrencyInfo = {
  id: string,
  symbol: string,
  name: string,
  image: string,
  current_price: number,
  market_cap: number,
  market_cap_rank: number,
  total_volume: number,
  high_24h: number,
  low_24h: number,
  price_change_percentage_24h: number,
  price_change_percentage_in_currency: number,
  market_cap_change_percentage_24h: number,
  circulating_supply: number,
  total_supply: number,
  max_supply: number,
  ath: number,
  ath_date: Date,
  atl: number,
  atl_date: Date,
  sparkline_in_7d: number[],
  supportedCurrency: Currency,
  magnitude: number,
  isStarred: boolean,
  difference: number,
};

export type MarketCurrencyCommonInfo = {
  id: string,
  symbol: string,
  name: string,
};

export type MarketFilters = {
  isLedgerCompatible: boolean,
};

export type CoinsListItemType = {
  id: "string",
  symbol: "string",
  name: "string",
};

export type FavoriteCryptoCurrency = {
  id: string,
};
