// @flow
import React, { useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";

import type {
  TokenCurrency,
  CryptoCurrency,
} from "@ledgerhq/live-common/lib/types";
import type { SwapDataType } from "@ledgerhq/live-common/lib/exchange/swap/hooks";
import type { SwapRouteParams } from "..";

import SearchIcon from "../../../icons/Search";
import LText from "../../../components/LText";
import { ScreenName } from "../../../const";
import Chevron from "../../../icons/Chevron";
import CurrencyIcon from "../../../components/CurrencyIcon";

type Props = {
  navigation: *,
  route: { params: SwapRouteParams },
  swap: SwapDataType,
  setToCurrency: (currency?: TokenCurrency | CryptoCurrency) => void,
  providers: any,
  provider: any,
};

export default function CurrencyTargetSelect({
  swap,
  navigation,
  route,
  setToCurrency,
  providers,
  provider,
}: Props) {
  const { colors } = useTheme();

  const value = swap.to.currency;

  const onPressItem = useCallback(() => {
    navigation.navigate(ScreenName.SwapV2FormSelectCurrency, {
      ...route.params,
      swap,
      setCurrency: setToCurrency,
      providers,
      provider,
    });
  }, [navigation, provider, providers, route.params, setToCurrency, swap]);

  return (
    <TouchableOpacity style={styles.root} onPress={onPressItem}>
      <View style={styles.root}>
        {value ? (
          <>
            <View style={styles.iconContainer}>
              <CurrencyIcon size={20} currency={value} />
            </View>
            <View style={styles.accountColumn}>
              <LText semiBold style={styles.label}>
                {value.name}
              </LText>
              <LText color="grey" style={styles.accountTicker}>
                {value.ticker}
              </LText>
            </View>
          </>
        ) : (
          <>
            <View style={styles.iconContainer}>
              <SearchIcon size={16} color={colors.grey} />
            </View>
            <LText style={styles.label} color="grey">
              <Trans i18nKey={`transfer.swap.form.target`} />
            </LText>
          </>
        )}
      </View>
      <View style={styles.chevron}>
        <Chevron size={16} color={colors.grey} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    lineHeight: 19,
  },
  chevron: {
    marginLeft: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  accountColumn: {
    flexDirection: "column",
  },
  accountTicker: {
    fontSize: 13,
    lineHeight: 16,
  },
});
