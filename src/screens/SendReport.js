// @flow
import React, { Component } from "react";
import { Sentry } from "react-native-sentry";
import { View, StyleSheet, Keyboard } from "react-native";
import { translate, Trans } from "react-i18next";
import i18next from "i18next";
import type { NavigationScreenProp } from "react-navigation";

import type { T } from "../types/common";

import { getFontStyle } from "../components/LText";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import KeyboardView from "../components/KeyboardView";

import { TrackScreen } from "../analytics";
import colors from "../colors";

type Props = {
  navigation: NavigationScreenProp<*>,
  t: T,
};
type State = {
  ticketNumber: ?string,
};

class SendReport extends Component<Props, State> {
  static navigationOptions = {
    title: i18next.t("SendReport.title"),
  };

  state = {
    ticketNumber: "",
  };

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  onChangeText = (ticketNumber: string) => {
    this.setState({ ticketNumber });
  };

  onInputCleared = () => {
    this.setState({ ticketNumber: "" });
  };

  onSubmit = () => {
    const { navigation } = this.props;
    const { ticketNumber } = this.state;
    const message = ticketNumber
      ? `Report #${ticketNumber} TEST`
      : "Report TEST";
    Sentry.captureMessage(message);
    Keyboard.dismiss();
    this.setState({ ticketNumber: "" });
    this.timeout = setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  timeout: *;

  render() {
    const { ticketNumber } = this.state;
    return (
      <KeyboardView style={styles.root}>
        <TrackScreen category="SendReport" />
        <View style={styles.body}>
          <TextInput
            value={ticketNumber}
            onChangeText={this.onChangeText}
            onInputCleared={this.onInputCleared}
            autoFocus
            selectTextOnFocus
            blurOnSubmit={false}
            clearButtonMode="always"
            placeholder="ticket number (optional)"
            style={[getFontStyle({ semiBold: true }), styles.input]}
          />
        </View>
        <View style={styles.footer}>
          <Button
            event="SendReportSubmit"
            type="primary"
            title={<Trans i18nKey="SendReport.action" />}
            onPress={this.onSubmit}
          />
        </View>
      </KeyboardView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  input: {
    fontSize: 24,
    color: colors.darkBlue,
  },
  body: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  footer: {
    flexDirection: "column",
    padding: 20,
  },
});

export default translate()(SendReport);
