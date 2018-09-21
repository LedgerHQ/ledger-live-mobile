/* @flow */
import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import ArrowLeft from "../icons/ArrowLeft";
import colors from "../colors";

const HeaderBackImage = () => (
  <View
    style={styles.root}
    hitSlop={{
      top: 16,
      left: 16,
      right: 16,
      bottom: 16,
    }}
  >
    <ArrowLeft size={16} color={colors.grey} />
  </View>
);

export default HeaderBackImage;

const styles = StyleSheet.create({
  root: {
    paddingLeft: Platform.OS === "ios" ? 16 : 3,
  },
});
