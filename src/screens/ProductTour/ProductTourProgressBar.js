// @flow

import { useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { context, STEPS } from "./Provider";

const PortfolioWidget = () => {
  const { colors } = useTheme();
  const ptContext = useContext(context);
  const total = Object.keys(STEPS).length;
  const progress = ptContext.completedSteps.length;
  const opacity = total === progress ? 0 : 1;

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: colors.ledgerGreen,
            width: `${(progress * 100) / total || 3}%`,
          },
        ]}
      />
      <View
        style={[
          styles.separator,
          { backgroundColor: colors.live, left: "33%", opacity },
        ]}
      />
      <View
        style={[
          styles.separator,
          { backgroundColor: colors.live, right: "33%", opacity },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: 4,
    height: 8,
    backgroundColor: "rgba(20, 37, 51, 0.5)",
    overflow: "hidden",
  },
  fill: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    height: 8,
  },
  separator: {
    width: 2,
    height: 8,
    position: "absolute",
  },
});

export default PortfolioWidget;
