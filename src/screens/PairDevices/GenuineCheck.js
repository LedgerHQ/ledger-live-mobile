// @flow

import { View, StyleSheet, ActivityIndicator } from "react-native";
import React, { PureComponent } from "react";
import { translate } from "react-i18next";

import colors from "../../colors";
import LText from "../../components/LText";

class Pairing extends PureComponent<*> {
  render() {
    return (
      <View style={styles.root}>
        <ActivityIndicator size="large" />
        <LText secondary semiBold style={styles.title}>
          Genuine check...
        </LText>
        <LText style={styles.subtitle}>
          Make sure your Nano X is on Dashboard and accept
        </LText>
        <LText bold style={styles.bold}>
          Allow Manager
        </LText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    color: colors.darkBlue,
  },
  subtitleContainer: {},
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  bold: {},
});

export default translate()(Pairing);
