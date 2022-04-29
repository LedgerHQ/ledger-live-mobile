// @flow

import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useTheme } from "@react-navigation/native";
import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { useRampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";
import { currenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import TrackScreen from "../../analytics/TrackScreen";
import { useRampCatalogCurrencies } from "./hooks";
import SelectAccountCurrency from "./SelectAccountCurrency";
import BigSpinner from "../../icons/BigSpinner";

type Props = {
  navigation: any,
  route: {
    params: {
      defaultAccountId?: string,
      defaultCurrencyId?: string,
      defaultTicker?: string,
    },
  },
};

type State = {
  sortedCurrencies: Array<TokenCurrency | CryptoCurrency>,
  isLoading: boolean,
};

export default function OnRamp({ route }: Props) {
  const [currencyState, setCurrencyState] = useState<State>({
    sortedCurrencies: [],
    isLoading: true,
  });
  const { colors } = useTheme();
  const rampCatalog = useRampCatalog();
  const allCurrencies = useRampCatalogCurrencies(
    rampCatalog && rampCatalog.value ? rampCatalog.value.onRamp : [],
  );

  const { defaultAccountId, defaultCurrencyId, defaultTicker } =
    route.params || {};

  useEffect(() => {
    const filteredCurrencies = defaultTicker
      ? allCurrencies.filter(currency => currency.ticker === defaultTicker)
      : allCurrencies;

    currenciesByMarketcap(filteredCurrencies).then(sortedCurrencies => {
      setCurrencyState({
        sortedCurrencies,
        isLoading: false,
      });
    });
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.card,
          paddingTop: extraStatusBarPadding,
        },
      ]}
    >
      <TrackScreen category="Multibuy" name="Buy" />
      {currencyState.isLoading ? (
        <View style={styles.spinner}>
          <BigSpinner size={42} />
        </View>
      ) : (
        <SelectAccountCurrency
          flow="buy"
          allCurrencies={currencyState.sortedCurrencies}
          defaultCurrencyId={defaultCurrencyId}
          defaultAccountId={defaultAccountId}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  spinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
