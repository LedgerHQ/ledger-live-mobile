// @flow

import React, { Component } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { BleErrorCode } from "react-native-ble-plx";
import { translate } from "react-i18next";
import LocationRequired from "../LocationRequired";
import LText from "../../components/LText";
import Button from "../../components/Button";
import TranslatedError from "../../components/TranslatedError";
import PairingFailure from "../../icons/PairingFailure";
import { PairingFailed, GenuineCheckFailed } from "../../errors";
import colors from "../../colors";

type Props = {
  error: Error,
  status: string,
  onCancel: () => void,
  onRetry: () => void,
  t: *,
};

class RenderError extends Component<Props> {
  render() {
    const { t, error, status, onCancel, onRetry } = this.props;

    // $FlowFixMe
    if (error.errorCode === BleErrorCode.LocationServicesDisabled) {
      return <LocationRequired />;
    }

    const primaryError =
      status === "pairing"
        ? new PairingFailed()
        : status === "genuinecheck"
          ? new GenuineCheckFailed()
          : error;

    return (
      <View style={styles.root}>
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
        >
          <PairingFailure />
          <LText semiBold style={styles.title}>
            <TranslatedError error={primaryError} />
          </LText>
          <LText style={styles.description}>
            <TranslatedError error={primaryError} field="description" />
          </LText>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            type="secondary"
            title={t("common.cancel")}
            onPress={onCancel}
            containerStyle={styles.button}
          />
          <Button
            type="primary"
            title={t("common.retry")}
            onPress={onRetry}
            containerStyle={[styles.button, styles.primaryButton]}
          />
        </View>
      </View>
    );
  }
}

export default translate()(RenderError);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },
  list: { flex: 1 },
  contentContainer: {
    paddingVertical: "20%",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: colors.darkBlue,
  },
  description: {
    fontSize: 14,
    color: colors.grey,
  },
  footer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
  },
  primaryButton: {
    marginLeft: 10,
  },
});
