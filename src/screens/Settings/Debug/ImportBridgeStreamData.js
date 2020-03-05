// @flow
import React from "react";
// $FlowFixMe
import { Buffer } from "buffer";
import { withNavigation } from "@react-navigation/compat";
import { NavigatorName, ScreenName } from "../../../const";
import SettingsRow from "../../../components/SettingsRow";

const ImportBridgeStreamData = ({
  title,
  navigation,
  dataStr,
}: {
  title: string,
  navigation: *,
  reboot: *,
  dataStr: *,
}) => (
  <SettingsRow
    title={title}
    onPress={() => {
      const data = JSON.parse(Buffer.from(dataStr, "base64").toString("utf8"));
      navigation.navigate(NavigatorName.ImportAccounts, {
        screen: ScreenName.ScanAccounts,
        params: { data },
      });
    }}
  />
);

export default withNavigation(ImportBridgeStreamData);
