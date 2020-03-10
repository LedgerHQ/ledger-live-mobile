// @flow
import React from "react";
import { TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import colors from "../colors";
import LText from "./LText";
import { headerPressSubject } from "../navigation/utils";

interface Props {
  title: React$Node;
  subtitle?: React$Node;
}

export default function StepHeader({ title, subtitle }: Props) {
  function onPress() {
    headerPressSubject.next();
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.root}>
        <LText style={styles.subtitle}>{subtitle}</LText>
        <LText semiBold secondary numberOfLines={1} style={styles.title}>
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
