// @flow

import React, { PureComponent, Fragment } from "react";
import { StyleSheet } from "react-native";
import { translate } from "react-i18next";

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
});

export default translate()(PendingGenuineCheck);
