// @flow
import React from "react";
import { TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import colors from "../colors";
import LText from "./LText";
import { scrollToTop } from "../navigation/utils";

type Props = {
  title: React$Node,
  subtitle?: React$Node,
  style?: any,
};

export default function StepHeader({ title, subtitle, style }: Props) {
  return (
    <TouchableWithoutFeedback onPress={scrollToTop}>
      <View style={styles.root}>
        <LText style={[styles.subtitle, style]}>{subtitle}</LText>
        <LText
          semiBold
          secondary
          numberOfLines={1}
          style={[styles.title, style]}
        >
          {title}
        </LText>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    flex: 1,
    paddingVertical: 5,
  },
  title: {
    textAlign: "center",
    flexGrow: 1,
    color: colors.darkBlue,
    fontSize: 16,
  },
  subtitle: {
    textAlign: "center",
    color: colors.grey,
  },
});
