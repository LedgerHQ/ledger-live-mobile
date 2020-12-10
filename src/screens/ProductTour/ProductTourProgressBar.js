// @flow

import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../colors";
import { context, STEPS } from "./Provider";

const PortfolioWidget = () => {
  const ptContext = useContext(context);
  const total = Object.keys(STEPS).length;
  const progress = ptContext.completedSteps.length;
  const opacity = total === progress ? 0 : 1;

  return (
    <View style={styles.root}>
      <View style={[styles.fill, { width: `${(progress * 100) / total}%` }]} />
      <View style={[styles.separator, { left: "33%", opacity }]} />
      <View style={[styles.separator, { right: "33%", opacity }]} />
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
    backgroundColor: colors.ledgerGreen,
  },
  separator: {
    width: 2,
    height: 8,
    position: "absolute",
    backgroundColor: colors.live,
  },
});

export default PortfolioWidget;
