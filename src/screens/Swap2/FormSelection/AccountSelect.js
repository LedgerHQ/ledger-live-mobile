// @flow
import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";

import type { Exchange } from "@ledgerhq/live-common/lib/exchange/swap/types";
import {
  getAccountCurrency,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";

import SearchIcon from "../../../icons/Search";
import LText from "../../../components/LText";
import { ScreenName } from "../../../const";
import Chevron from "../../../icons/Chevron";
import CurrencyIcon from "../../../components/CurrencyIcon";

type Props = {
  navigation: *,
  exchange: Exchange,
};

export default function AccountSelect({ navigation, exchange }: Props) {
  const { colors } = useTheme();

  const value = exchange.fromAccount;

  const currency = useMemo(() => value && getAccountCurrency(value), [value]);
  const name = useMemo(() => value && getAccountName(value), [value]);

  const onPressItem = useCallback(() => {
    navigation.navigate(ScreenName.SwapV2FormSelectAccount, {
      exchange: {
        ...exchange,
        fromAccount: null,
      },
      target: "from",
    });
  }, [exchange, navigation]);

  return (
    <TouchableOpacity style={styles.root} onPress={onPressItem}>
      <View style={styles.root}>
        {value ? (
          <>
            <View style={styles.iconContainer}>
              <CurrencyIcon size={20} currency={currency} />
            </View>
            <View style={styles.accountColumn}>
              <LText semiBold style={styles.label}>
                {name}
              </LText>
              <LText color="grey" style={styles.accountTicker}>
                {currency.ticker}
              </LText>
            </View>
          </>
        ) : (
          <>
            <View style={styles.iconContainer}>
              <SearchIcon size={16} color={colors.grey} />
            </View>
            <LText style={styles.label} color="grey">
              <Trans i18nKey={`transfer.swap.form.source`} />
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
