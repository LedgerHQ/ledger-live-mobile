// @flow
import React, { useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";

import type { Exchange } from "@ledgerhq/live-common/lib/exchange/swap/types";

import SearchIcon from "../../../icons/Search";
import LText from "../../../components/LText";
import { ScreenName } from "../../../const";
import Chevron from "../../../icons/Chevron";
import CurrencyIcon from "../../../components/CurrencyIcon";

type Props = {
  navigation: *,
  exchange: Exchange,
  provider: any,
  providers: any,
};

export default function CurrencyTargetSelect({
  navigation,
  exchange,
  provider,
  providers,
}: Props) {
  const { colors } = useTheme();

  const value = exchange.toCurrency;

  const onPressItem = useCallback(() => {
    navigation.navigate(ScreenName.SwapV2FormSelectCurrency, {
      exchange: {
        ...exchange,
        toCurrency: null,
      },
      providers,
      provider,
    });
  }, [exchange, navigation, providers, provider]);

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
