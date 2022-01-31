import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "styled-components/native";

export default () => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.constant.purple,
          borderColor: colors.background.main,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: -5,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
  },
});
