/* @flow */
import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import { AppState, Linking } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import i18next from "i18next";
import type { T } from "../../types/common";
import FallbackCameraBody from "../../components/FallbackCameraBody";

type Props = {
  navigation: NavigationScreenProp<*>,
  t: T,
};
type State = {
  appSTate: string,
  openSettingsPressed: boolean,
};
class FallBackCameraScreen extends PureComponent<Props, State> {
  state = {
    appState: AppState.currentState,
    openSettingsPressed: false,
  };

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    const { appState, openSettingsPressed } = this.state;
    const { navigation } = this.props;
    if (
      appState.match(/inactive|background/) &&
      nextAppState === "active" &&
      openSettingsPressed
    ) {
      navigation.replace("ScanAccounts");
    }
    this.setState({ appState: nextAppState });
  };

  openNativeSettings = () => {
    this.setState({ openSettingsPressed: true });
    Linking.openSettings();
  };

  render() {
    const { t } = this.props;
    return (
      <FallbackCameraBody
        title={t("account.import.fallback.title")}
        description={t("account.import.fallback.desc")}
        buttonTitle={t("account.import.fallback.buttonTitle")}
        onPress={this.openNativeSettings}
      />
    );
  }
}

export default withTranslation()(FallBackCameraScreen);
