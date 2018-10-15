// @flow

import { View, StyleSheet, ActivityIndicator } from "react-native";
import React, { PureComponent } from "react";

import colors from "../../colors";
import LText from "../../components/LText";

class Pairing extends PureComponent {
  render() {
    return (
      <View style={styles.root}>
        <ActivityIndicator size={32} />
        <LText secondary semiBold style={styles.title}>
          Pairing...
        </LText>
        <LText style={styles.subtitle}>
          Please don’t turn off your Nano X. Follow screen instructions.
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
  subtitleContainer: {
    maxWidth: 250,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    maxWidth: 250,
    textAlign: "center",
  },
});

export default Pairing;
