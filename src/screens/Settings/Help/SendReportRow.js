/* @flow */
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import type { NavigationScreenProp } from "react-navigation";
import SettingsRow from "../../../components/SettingsRow";

type Props = {
  navigation: NavigationScreenProp<{}>,
};

class SendReportRow extends PureComponent<Props> {
  onPress = async () => {
    this.props.navigation.navigate("SendReport");
  };

  render() {
    return (
      <SettingsRow
        event="SendReportRow"
        title={<Trans i18nKey="settings.help.sendReport" />}
        desc={<Trans i18nKey="settings.help.sendReportDesc" />}
        arrowRight
        onPress={this.onPress}
        alignedTop
      />
    );
  }
}

export default SendReportRow;
