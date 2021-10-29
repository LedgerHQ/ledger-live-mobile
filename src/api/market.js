import { APIClient } from "./index";
import { MarketCurrencyCommonInfo, MarketCurrencyInfo } from "./types";

type MarketListRequestParams = {
  counterCurrency?: string,
  ids?: string,
  page?: number,
  limit?: number,
  range?: string,
  orderBy?: string,
  order?: string,
};
type CurrencyDataRequestParams = {
  counterCurrency?: string,
  page?: number,
  limit?: number,
  range?: string
};

export type MarketCurrencyByIdRequestParams = {
  id: string,
  counterCurrency: string,
  range: string,
};

type MarketCurrencyChartDataRequestParams = {
  id: string,
  counterCurrency: string,
  days: number,
  interval: string,
};

export class MarketClient extends APIClient {
  ROOT_PATH: string = "https://api.coingecko.com/api/v3";

  // fetches currencies data for selected currencies ids
  // ids can be empty for fetching all currencies
  async listPaginated({
    counterCurrency,
    range,
    limit = 10,
    page = 1,
    ids = "",
    orderBy = "market_cap",
    order = "desc",
  }: MarketListRequestParams): Promise<MarketCurrencyInfo[]> {
    let path = `${this.ROOT_PATH}/coins/markets?vs_currency=${counterCurrency}&order=${orderBy}_${order}&per_page=${limit}&page=${page}&sparkline=true&price_change_percentage=${range}`;
    if (ids.length) {
      path += `&ids=${ids}`;
    }
    const response = await this.http.get(path);

    if (!response.ok) {
      await this.handleError(response);
    }
    const currenciesJson = await response.json();
    return currenciesJson;
  }

  // Fetches list of supported counterCurrencies
  async supportedCounterCurrencies(): Promise<string[]> {
    const path = `${this.ROOT_PATH}/simple/supported_vs_currencies`;

    const response = await this.http.get(path);

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.json();
  }

  // Fetches list of supported currencies
  // Hard to perform
  async supportedCurrencies(): Promise<MarketCurrencyCommonInfo[]> {
    const path = `${this.ROOT_PATH}/coins/list?include_platform=false`;

    const response = await this.http.get(path);

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.json();
  }

  // Fetches list of supported currencies
  // Hard to perform
  async currencyChartData({
    id,
    counterCurrency,
    days,
    interval,
  }: MarketCurrencyChartDataRequestParams): Promise<number[]> {
    const path = `${this.ROOT_PATH}/coins/${id}/market_chart?vs_currency=${counterCurrency}&days=${days}&interval=${interval}`;

    const response = await this.http.get(path);

    if (!response.ok) {
      await this.handleError(response);
    }

    const marketChartJson = await response.json();

    return marketChartJson.prices.map(chartData => chartData[1]);
  }

  // Fetches info for single currency
  async currencyById({
    id,
    counterCurrency,
    range,
  }: MarketCurrencyByIdRequestParams): Promise<MarketCurrencyInfo> {
    const currenciesInfos = await this.listPaginated({
      ids: id,
      limit: 1,
      page: 1,
      counterCurrency,
      range,
    });
    // currenciesInfos
    return currenciesInfos[0];
  }

  async getCurrencyData({limit, page, counterCurrency, range}:CurrencyDataRequestParams) {
    const currenciesInfos = await this.listPaginated({
      ids: "",
      limit,
      page,
      counterCurrency,
      range,
    });
    // currenciesInfos
    return currenciesInfos;
  }
}
