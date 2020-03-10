/* @flow */
import React from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import LText from "./LText";
import colors from "../colors";
import { headerPressSubject } from "../navigation/utils";

export default function HeaderTitle({ style, ...newProps }: *) {
  function onPress(): void {
    headerPressSubject.next();
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
