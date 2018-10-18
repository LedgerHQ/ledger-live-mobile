// @flow

import React, { PureComponent, Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { translate } from "react-i18next";
import DeviceNanoAction from "../../components/DeviceNanoAction";

import colors from "../../colors";
import LText from "../../components/LText";

class PendingGenuineCheck extends PureComponent<*> {
  render() {
    return (
      <Fragment>
        <LText secondary semiBold style={styles.title}>
          Genuine check...
        </LText>
        <LText style={styles.subtitle}>
          Make sure your Nano X is on Dashboard and accept
        </LText>
        <LText bold style={styles.bold}>
          Allow Manager
        </LText>

        <View style={styles.footer}>
          <DeviceNanoAction powerAction validationOnScreen />
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
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
  footer: {
    position: "relative",
    right: "-20%",
    marginTop: 20,
  },
});

export default translate()(PendingGenuineCheck);
