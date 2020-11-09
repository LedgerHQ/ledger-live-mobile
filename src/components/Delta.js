// @flow

import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

import type { Unit, ValueChange } from "@ledgerhq/live-common/lib/types";

import { useTheme } from "@react-navigation/native";
import LText from "./LText";
import CurrencyUnitValue from "./CurrencyUnitValue";
import IconArrowUp from "../icons/ArrowUp";
import IconArrowDown from "../icons/ArrowDown";

type Props = {
  valueChange: ValueChange,
  percent?: boolean,
  unit?: Unit,
  style?: *,
};

function Delta({ valueChange, percent, unit, style }: Props) {
  const { colors } = useTheme();
  if (
    percent &&
    (!valueChange.percentage || valueChange.percentage.isEqualTo(0))
  ) {
    return null;
  }

  const delta =
    percent && valueChange.percentage
      ? valueChange.percentage.multipliedBy(100)
      : valueChange.value;

  if (delta.isNaN()) {
    return null;
  }

  const absDelta = delta.absoluteValue();

  return (
    <View style={[styles.root, style]}>
      {!delta.isZero() ? (
        delta.isGreaterThan(0) ? (
          <IconArrowUp size={12} color={colors.success} />
        ) : (
          <IconArrowDown size={12} color={colors.alert} />
        )
      ) : null}
      <View style={styles.content}>
        <LText semiBold style={styles.text}>
          {unit ? (
            <CurrencyUnitValue unit={unit} value={absDelta} />
          ) : percent ? (
            `${absDelta.toFixed(0)}%`
          ) : null}
        </LText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginLeft: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default memo<Props>(Delta);
