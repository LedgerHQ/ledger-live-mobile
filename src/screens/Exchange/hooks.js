// @flow
import { useMemo } from "react";
import {
  listCryptoCurrencies,
  listTokens,
} from "@ledgerhq/live-common/lib/currencies";

import useEnv from "@ledgerhq/live-common/lib/hooks/useEnv";
import { useSelector } from "react-redux";
import { RampCatalogEntry } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/types";
import { getAllSupportedCryptoCurrencyIds } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/helpers";
import { blacklistedTokenIdsSelector } from "../../reducers/settings";

export const useRampCatalogCurrencies = (entries: RampCatalogEntry[]) => {
  const devMode = useEnv("MANAGER_DEV_MODE");

  // fetching all live supported currencies including tokens
  const cryptoCurrencies = useMemo(
    () => listCryptoCurrencies(devMode).concat(listTokens()),
    [devMode],
  );

  const blacklistedTokenIds = useSelector(blacklistedTokenIdsSelector);

  const supportedCurrenciesIds = getAllSupportedCryptoCurrencyIds(entries);

  return cryptoCurrencies.filter(
    currency =>
      supportedCurrenciesIds.includes(currency.id) &&
      !blacklistedTokenIds.includes(currency.id),
  );
};
