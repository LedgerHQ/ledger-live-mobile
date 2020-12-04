// @flow

import React, { useContext } from "react";
import { Trans } from "react-i18next";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import LText from "../../components/LText";
import colors from "../../colors";
import { context, STEPS, dismiss } from "./Provider";

type Props = {
  navigation: any,
};

const PortfolioWidget = ({ navigation }: Props) => {
  const ptContext = useContext(context);

  if (ptContext.dismissed) {
    return null;
  }

  return (
    <View style={styles.root}>
      <LText secondary style={styles.title} bold>
        PortfolioWidget ({ptContext.completedSteps.length} / {STEPS.length})
      </LText>
      <TouchableOpacity onPress={() => dismiss(true)}>
        <LText>Dismiss</LText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <LText>Continue</LText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    color: colors.darkBlue,
    justifyContent: "center",
  },
});

export default PortfolioWidget;
