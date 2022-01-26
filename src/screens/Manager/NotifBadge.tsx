import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "styled-components/native";

export default () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.constant.purple }]} />
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
});
