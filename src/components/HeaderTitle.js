/* @flow */
import React from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LText from "./LText";
import colors from "../colors";

export default function HeaderTitle({ style, ...newProps }: *) {
  const navigation = useNavigation();

  function onPress(): void {
    navigation.emit("refocus");
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <LText
        {...newProps}
        secondary
        semiBold
        style={[styleSheet.root, style]}
      />
    </TouchableWithoutFeedback>
  );
}

const styleSheet = StyleSheet.create({
  root: {
    color: colors.darkBlue,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
