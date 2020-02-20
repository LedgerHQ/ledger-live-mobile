/* @flow */
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { StyleSheet } from "react-native";
import { withNavigation } from "@react-navigation/compat";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";

import LText from "../../components/LText";
import colors from "../../colors";
import Row from "./Row";

type Props = {
  navigation: *,
  deviceInfo: DeviceInfo,
};

class FirmwareVersionRow extends PureComponent<Props> {
  render() {
    const { deviceInfo } = this.props;
    return (
      <Row
        title={<Trans i18nKey="FirmwareVersionRow.title" />}
        alignedTop
        compact
        bottom
      >
        <LText numberOfLines={1} style={styles.version}>
          {deviceInfo.version}
        </LText>
      </Row>
    );
  }
}

export default withNavigation(FirmwareVersionRow);

const styles = StyleSheet.create({
  version: {
    flexShrink: 1,
    textAlign: "right",
    color: colors.grey,
  },
});
