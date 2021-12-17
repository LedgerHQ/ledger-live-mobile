// @flow
// TODO: Move to live-common

import { AvailableProvider } from "@ledgerhq/live-common/lib/exchange/swap/types";

export type ProvidersByName = {
  [string]: AvailableProvider,
};

export type SwapProvidersProps = {
  disabledProviders: string,
  setCurrencies: (currencies: string[]) => void,
};

export type SwapProviders = {
  providers?: ProvidersByName[],
  provider?: AvailableProvider,
};
