// @flow

import React from "react";
import { RampLiveAppCatalogEntry } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/types";
import { useRemoteLiveAppManifest } from "@ledgerhq/live-common/lib/platform/providers/RemoteLiveAppProvider";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { mapQueryParamsForProvider } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/helpers";
import { languageSelector } from "../../reducers/settings";
import WebPlatformPlayer from "../../components/WebPlatformPlayer";

type TradeParams = {
  type: "onRamp" | "offRamp",
  cryptoCurrencyId: string,
  fiatCurrencyId: string,
  fiatAmount?: number,
  cryptoAmount?: number,
};

type ProviderViewProps = {
  navigation: any,
  route: { params: RouteParams, name: string },
};

type RouteParams = {
  provider: RampLiveAppCatalogEntry,
  accountId: string,
  accountAddress: string,
  trade: TradeParams,
  icon: string,
  name: string,
};

export default function ProviderView({ route }: ProviderViewProps) {
  const manifest = useRemoteLiveAppManifest(route.params.provider.appId);
  const { colors } = useTheme();
  const language = useSelector(languageSelector);
  const cryptoCurrency = route.params.provider.cryptoCurrencies.find(
    crypto => crypto.id === route.params.trade.cryptoCurrencyId,
  );
  const inputs = mapQueryParamsForProvider(route.params.provider, {
    accountId: route.params.accountId,
    accountAddress: route.params.accountAddress,
    cryptoCurrencyId: cryptoCurrency ? cryptoCurrency.providerId : undefined,
    fiatCurrencyId: route.params.trade.fiatCurrencyId.toLocaleLowerCase(),
    primaryColor: colors.fog,
    mode: route.params.trade.type,
    theme: colors.fog,
    language,
    fiatAmount: route.params.trade.fiatAmount,
    cryptoAmount: route.params.trade.cryptoAmount,
  });

  return (
    <WebPlatformPlayer onClose={() => {}} manifest={manifest} inputs={inputs} />
  );
}
