// @flow
import React from "react";
import { TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import LText from "./LText";

interface Props {
  title: React$Node;
  subtitle?: React$Node;
}

export default function StepHeader({ title, subtitle }: Props) {
  const navigation = useNavigation();

  function onPress() {
    navigation.emit("refocus");
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
