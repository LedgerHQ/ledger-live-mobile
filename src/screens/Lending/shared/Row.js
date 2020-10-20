// @flow

import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import type { TokenAccount, Account } from "@ledgerhq/live-common/lib/types";
import type { BigNumber } from "bignumber.js";
import { getAccountName } from "@ledgerhq/live-common/lib/account/helpers";
import LText from "../../../components/LText";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import CurrencyIcon from "../../../components/CurrencyIcon";
import CounterValue from "../../../components/CounterValue";
import colors from "../../../colors";

type RowProps = {
  account: TokenAccount,
  parentAccount: ?Account,
  value: BigNumber,
  onPress?: () => void,
};

export default function Row({
  account,
  parentAccount,
  value,
  onPress,
}: RowProps) {
  const { token } = account;
  const name = getAccountName(account);
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <CurrencyIcon radius={100} currency={token} size={32} />
      <View style={styles.currencySection}>
        <LText semiBold style={styles.subTitle}>
          {parentAccount?.name}
        </LText>
        <LText semiBold style={styles.title}>
          {name}
        </LText>
      </View>
      <View style={[styles.currencySection, styles.alignEnd]}>
        <LText semiBold>
          <CurrencyUnitValue unit={token.units[0]} value={value} showCode />
        </LText>
        <LText style={styles.subTitle}>
          <CounterValue
            currency={token}
            value={value}
            disableRounding
            fontSize={3}
            showCode
            alwaysShowSign={false}
          />
        </LText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 8,
    height: 70,
  },
  currencySection: { paddingHorizontal: 8, flex: 1 },
  alignEnd: {
    alignItems: "flex-end",
  },
  title: {
    lineHeight: 17,
    fontSize: 14,
    color: colors.darkBlue,
  },
  subTitle: {
    lineHeight: 15,
    fontSize: 12,
    color: colors.grey,
  },
});
