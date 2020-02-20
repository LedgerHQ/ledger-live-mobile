// @flow

import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import { withNavigation } from "@react-navigation/compat";
import { Trans } from "react-i18next";
import { getDeviceModel } from "@ledgerhq/devices";
import { compose } from "redux";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import colors from "../../colors";
import { TrackScreen } from "../../analytics";
import LText from "../../components/LText";
import InfoIcon from "../../components/InfoIcon";
import Check from "../../icons/Check";
import Button from "../../components/Button";
import DeviceItemSummary from "../../components/DeviceItemSummary";
import NanoX from "../../icons/NanoX";
import { deviceNameByDeviceIdSelector } from "../../reducers/ble";

class Paired extends PureComponent<{
  deviceId: string,
  deviceName: string,
  name?: string,
  onContinue: (deviceId: string) => *,
  navigation: *,
  genuine: boolean,
}> {
  onEdit = () => {
    const { deviceId, name, deviceName, navigation } = this.props;
    navigation.navigate("EditDeviceName", {
      deviceId,
      deviceName: name || deviceName,
    });
  };

  onContinue = () => {
    this.props.onContinue(this.props.deviceId);
  };

  render() {
    const { deviceId, genuine } = this.props;
    return (
      <View style={styles.root}>
        <TrackScreen category="PairDevices" name="Paired" />
        <View style={styles.container}>
          <InfoIcon
            bg={colors.pillActiveBackground}
            floatingIcon={<Check color={colors.white} size={16} />}
            floatingBg={colors.green}
          >
            <NanoX size={48} color={colors.live} />
          </InfoIcon>
          <LText secondary semiBold style={styles.title}>
            <Trans
              i18nKey="PairDevices.Paired.title"
              values={getDeviceModel("nanoX")}
            />
          </LText>
          <LText style={styles.description}>
            <Trans
              i18nKey="PairDevices.Paired.desc"
              values={getDeviceModel("nanoX")}
            />
          </LText>
          <View style={styles.fullContainer}>
            <DeviceItemSummary
              deviceId={deviceId}
              genuine={genuine}
              onEdit={this.onEdit}
            />
          </View>
        </View>
        <View style={styles.fullContainer}>
          <Button
            event="PairDevicesContinue"
            type="primary"
            title={<Trans i18nKey="PairDevices.Paired.action" />}
            onPress={this.onContinue}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fullContainer: {
    width: "100%",
  },
  title: {
    marginTop: 32,
    fontSize: 18,
    color: colors.darkBlue,
  },
  description: {
    marginTop: 16,
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 40,
    color: colors.smoke,
  },
});

export default compose(
  connect(
    createStructuredSelector({
      name: deviceNameByDeviceIdSelector,
    }),
  ),
  withNavigation,
)(Paired);
