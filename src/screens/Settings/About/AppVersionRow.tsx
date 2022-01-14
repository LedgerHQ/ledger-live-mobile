import React from "react";
import VersionNumber from "react-native-version-number";
import { Trans } from "react-i18next";
import { Text } from "@ledgerhq/native-ui";
import cleanBuildVersion from "../../../logic/cleanBuildVersion";
import SettingsRow from "../../../components/SettingsRow";

function AppVersionRow() {
  const { appVersion, buildVersion } = VersionNumber;
  const version = `${appVersion || ""} (${cleanBuildVersion(buildVersion) ||
    ""})`;
  return (
    <SettingsRow
      event="AppVersionRow"
      title={<Trans i18nKey="settings.about.appVersion" />}
    >
      <Text variant={"body"} fontWeight={"medium"} color={"primary.c80"}>
        {version}
      </Text>
    </SettingsRow>
  );
}

export default AppVersionRow;
