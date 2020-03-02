/* @flow */
import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import { Linking } from "react-native";
import type { T } from "../../../types/common";
import FallbackCameraBody from "../../../components/FallbackCameraBody";

class FallBackCameraScreen extends PureComponent<{
  navigation: *,
  t: T,
}> {
  openNativeSettings = () => {
    Linking.openURL("app-settings:");
  };

  render() {
    const { t } = this.props;
    return (
      <FallbackCameraBody
        title={t("send.scan.fallback.title")}
        description={t("send.scan.fallback.desc")}
        buttonTitle={t("send.scan.fallback.buttonTitle")}
        onPress={this.openNativeSettings}
      />
    );
  }
}

export default withTranslation()(FallBackCameraScreen);
