/* @flow */
import React from "react";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import LText from "./LText";

type Props = {
  color: string,
  focused: boolean,
  i18nKey: string,
  Icon: any,
};

export default function TabIcon({ Icon, i18nKey, color, focused }: Props) {
  return (
    <View style={styles.root}>
      <Icon size={20} color={color} />
      <LText
        numberOfLines={1}
        semiBold={!focused}
        bold={focused}
        secondary
        style={[styles.text, { color }]}
      >
        <Trans i18nKey={i18nKey} />
      </LText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  text: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: "center",
    paddingVertical: 6,
  },
});
