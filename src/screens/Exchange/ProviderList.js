// @flow

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useTheme } from "@react-navigation/native";
import { useRampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";
import { useRemoteLiveAppManifest } from "@ledgerhq/live-common/lib/platform/providers/RemoteLiveAppProvider";
import {
  filterRampCatalogEntries,
  mapQueryParamsForProvider,
} from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/helpers";
import { useSelector } from "react-redux";
import { RampLiveAppCatalogEntry } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/types";
import type { AccountLike } from "@ledgerhq/live-common/lib/types/account";
import type {
  Account,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import AppIcon from "../Platform/AppIcon";
import LText from "../../components/LText";

import ApplePay from "../../icons/ApplePay";
import GooglePay from "../../icons/GooglePay";
import Maestro from "../../icons/Maestro";
import MasterCard from "../../icons/MasterCard";
import PayPal from "../../icons/PayPal";
import Sepa from "../../icons/Sepa";
import Visa from "../../icons/Visa";
import {
  counterValueCurrencySelector,
  languageSelector,
} from "../../reducers/settings";
import WebPlatformPlayer from "../../components/WebPlatformPlayer";

const forceInset = { bottom: "always" };

const assetMap = {
  applepay: ApplePay,
  googlepay: GooglePay,
  maestro: Maestro,
  mastercard: MasterCard,
  paypal: PayPal,
  sepa: Sepa,
  visa: Visa,
};

type ProviderItemProps = {
  provider: RampLiveAppCatalogEntry,
  onClick: () => void,
};

const ProviderItem = ({ provider, onClick }: ProviderItemProps) => {
  const manifest = useRemoteLiveAppManifest(provider.appId);

  if (!manifest) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onClick}>
      <View>
        <AppIcon icon={manifest.icon} name={manifest.name} size={48} />
        <LText>{manifest.name}</LText>
      </View>
      <View>
        {provider.paymentProviders.map(paymentProvider => (
          <View key={paymentProvider}>
            {assetMap[paymentProvider] ? (
              <Image source={assetMap[paymentProvider]} />
            ) : (
              <LText>{paymentProvider}</LText>
            )}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

type TradeParams = {
  type: "onRamp" | "offRamp",
  cryptoCurrencyId: string,
  fiatCurrencyId: string,
  fiatAmount?: number,
  cryptoAmount?: number,
};

type ProviderViewProps = {
  provider: RampLiveAppCatalogEntry,
  onClose: () => void,
  account: AccountLike,
  trade: TradeParams,
};

function ProviderView({
  provider,
  onClose,
  trade,
  account,
}: ProviderViewProps) {
  const manifest = useRemoteLiveAppManifest(provider.appId);
  const { colors } = useTheme();
  const language = useSelector(languageSelector);
  const cryptoCurrency = provider.cryptoCurrencies.find(
    crypto => crypto.id === trade.cryptoCurrencyId,
  );
  const inputs = mapQueryParamsForProvider(provider, {
    accountId: account.id,
    accountAddress: account.freshAddress,
    cryptoCurrencyId: cryptoCurrency ? cryptoCurrency.providerId : undefined,
    fiatCurrencyId: trade.fiatCurrencyId.toLocaleLowerCase(),
    primaryColor: colors.grey,
    mode: trade.type,
    theme: colors.grey,
    language,
    fiatAmount: trade.fiatAmount,
    cryptoAmount: trade.cryptoAmount,
  });

  return (
    <>
      <WebPlatformPlayer
        onClose={onClose}
        manifest={manifest}
        inputs={inputs}
      />
      ;
    </>
  );
}

type Props = {
  navigation: any,
  route: { params: RouteParams, name: string },
};

type RouteParams = {
  account: Account | AccountLike,
  currency: CryptoCurrency | TokenCurrency,
};

export default function ProviderList({ route }: Props) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const { colors } = useTheme();
  const rampCatalog = useRampCatalog();

  const fiatCurrency = useSelector(counterValueCurrencySelector);
  const cryptoCurrencyId = route.params.currency.id;

  const filteredProviders = filterRampCatalogEntries(rampCatalog.value.onRamp, {
    cryptoCurrencies: cryptoCurrencyId ? [cryptoCurrencyId] : undefined,
    fiatCurrencies: fiatCurrency.ticker
      ? [fiatCurrency.ticker.toLowerCase()]
      : undefined,
  });

  if (selectedProvider) {
    return (
      <ProviderView
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
        account={route.params.account}
        trade={{
          type: "onRamp",
          cryptoCurrencyId,
          fiatCurrencyId: fiatCurrency.ticker,
          fiatAmount: 400,
        }}
      />
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.card,
          paddingTop: extraStatusBarPadding,
        },
      ]}
      forceInset={forceInset}
    >
      {filteredProviders.map(provider =>
        provider.type === "LIVE_APP" ? (
          <ProviderItem
            provider={provider}
            key={provider.name}
            onClick={() => setSelectedProvider(provider)}
          />
        ) : null,
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    minWidth: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "transparent",
    padding: 20,
    marginTop: 16,
  },
});
