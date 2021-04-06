/* @flow */
import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import LText from "./LText";
import { reportLayout } from "../screens/ProductTour/Provider";

type Props = {
  color: string,
  focused: boolean,
  i18nKey: string,
  Icon: any,
  ptIds?: [string],
};

export default function TabIcon({
  Icon,
  i18nKey,
  color,
  focused,
  ptIds,
}: Props) {
  const ref = useRef();
  return (
    <View
      style={styles.root}
      ref={ref}
      onLayout={() => reportLayout(ptIds, ref, { y: 8 })}
    >
      <Icon size={18} color={color} />
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
    padding: 4,
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
});
