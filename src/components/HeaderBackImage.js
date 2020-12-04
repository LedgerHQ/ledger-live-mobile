/* @flow */
import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import ArrowLeft from "../icons/ArrowLeft";
import colors from "../colors";

type Props = {
  tintColor?: string | null,
};

export default function HeaderBackImage({ tintColor }: Props) {
  return (
    <View style={styles.root}>
      <ArrowLeft size={16} color={tintColor || colors.grey} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginLeft: Platform.OS === "ios" ? 0 : -13,
    padding: 16,
  },
});
