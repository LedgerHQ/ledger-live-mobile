// @flow
// TODO: Move to live-common

import { getEnv } from "@ledgerhq/live-common/lib/env";
import {
  GetProviders,
  AvailableProvider,
} from "@ledgerhq/live-common/lib/exchange/swap/types";
import { mockGetProviders } from "@ledgerhq/live-common/lib/exchange/swap/mock";
import network from "@ledgerhq/live-common/lib/network";
import { SwapNoAvailableProviders } from "@ledgerhq/live-common/lib/errors";
import type { ProvidersByName } from "./types";

export function getSwapAPIBaseURL(): string {
  // TODO replace with this
  // return getEnv("SWAP_V2_API_BASE");
  return "https://swap.staging.aws.ledger.fr/v3";
}

export const getProviders: GetProviders = async () => {
  if (getEnv("MOCK")) return mockGetProviders();
  const res = await network({
    method: "GET",
    url: `${getSwapAPIBaseURL()}/providers`,
  });

  if (!res.data.length) {
    return new SwapNoAvailableProviders();
  }

  return res.data;
};

export function getProvidersByName(
  providers: AvailableProvider[],
  disabledProviders: string,
): ProvidersByName {
  return providers.reduce((acc, p) => {
    if (disabledProviders.includes(p.provider)) {
      return acc;
    }

    return {
      ...acc,
      [p.provider]: p,
    };
  }, {});
}

export function getProvider(
  providers: AvailableProvider[],
  providersByName: ProvidersByName,
): AvailableProvider {
  if ("ftx" in providersByName) {
    return providersByName.ftx;
  }

  if ("wyre" in providersByName && "changelly" in providersByName) {
    return providersByName.changelly;
  }

  return providers.find(
    p => !Object.keys(providersByName).includes(p.provider),
  );
}
