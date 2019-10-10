// @flow
import {
  flattenAccounts,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";
import {
  getBalanceHistoryWithCountervalue,
  getCurrencyPortfolio,
  getPortfolio,
} from "@ledgerhq/live-common/lib/portfolio";
import type {
  PortfolioRange,
  TokenCurrency,
  CryptoCurrency,
  AccountLike,
} from "@ledgerhq/live-common/lib/types";
import {
  counterValueCurrencySelector,
  exchangeSettingsForPairSelector,
  intermediaryCurrency,
  selectedTimeRangeSelector,
} from "../reducers/settings";
import CounterValues from "../countervalues";
import { accountsSelector } from "../reducers/accounts";
import type { State } from "../reducers";

export const balanceHistoryWithCountervalueSelector = (
  state: State,
  {
    account,
    range,
  }: {
    account: AccountLike,
    range: PortfolioRange,
  },
) => {
  const counterValueCurrency = counterValueCurrencySelector(state);
  const currency = getAccountCurrency(account);
  const intermediary = intermediaryCurrency(currency, counterValueCurrency);
  const exchange = exchangeSettingsForPairSelector(state, {
    from: currency,
    to: intermediary,
  });
  const toExchange = exchangeSettingsForPairSelector(state, {
    from: intermediary,
    to: counterValueCurrency,
  });
  return getBalanceHistoryWithCountervalue(account, range, (_, value, date) =>
    CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: currency,
      fromExchange: exchange,
      intermediary,
      toExchange,
      to: counterValueCurrency,
    }),
  );
};

export const portfolioSelector = (state: State) => {
  const accounts = accountsSelector(state);
  const range = selectedTimeRangeSelector(state);
  const counterValueCurrency = counterValueCurrencySelector(state);
  return getPortfolio(accounts, range, (currency, value, date) => {
    const intermediary = intermediaryCurrency(currency, counterValueCurrency);
    const toExchange = exchangeSettingsForPairSelector(state, {
      from: intermediary,
      to: counterValueCurrency,
    });
    return CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: currency,
      fromExchange: exchangeSettingsForPairSelector(state, {
        from: currency,
        to: intermediary,
      }),
      intermediary,
      toExchange,
      to: counterValueCurrency,
    });
  });
};

export const currencyPortfolioSelector = (
  state: State,
  {
    currency,
    range,
  }: {
    currency: CryptoCurrency | TokenCurrency,
    range: PortfolioRange,
  },
) => {
  const accounts = flattenAccounts(accountsSelector(state)).filter(
    a => getAccountCurrency(a) === currency,
  );

  const counterValueCurrency = counterValueCurrencySelector(state);
  return getCurrencyPortfolio(accounts, range, (currency, value, date) => {
    const intermediary = intermediaryCurrency(currency, counterValueCurrency);
    const toExchange = exchangeSettingsForPairSelector(state, {
      from: intermediary,
      to: counterValueCurrency,
    });
    return CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: currency,
      fromExchange: exchangeSettingsForPairSelector(state, {
        from: currency,
        to: intermediary,
      }),
      intermediary,
      toExchange,
      to: counterValueCurrency,
    });
  });
};
