// @flow

import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import type { NavigationScreenProp } from "react-navigation";
import { BleErrorCode } from "react-native-ble-plx";
import TransportBLE from "../../react-native-hw-transport-ble";

import { addKnownDevice } from "../../actions/ble";
import { knownDevicesSelector } from "../../reducers/ble";
import type { DeviceLike } from "../../reducers/ble";
import genuineCheck from "../../logic/hw/genuineCheck";
import getDeviceName from "../../logic/hw/getDeviceName";
import colors from "../../colors";
import LocationRequired from "../LocationRequired";
import LText from "../../components/LText";
import HeaderRightClose from "../../components/HeaderRightClose";
import RequiresBLE from "../../components/RequiresBLE";
import TranslatedError from "../../components/TranslatedError";
import Pairing from "./Pairing";
import GenuineCheck from "./GenuineCheck";
import Paired from "./Paired";
import Scanning from "./Scanning";
import ScanningTimeout from "./ScanningTimeout";

type Props = {
  navigation: NavigationScreenProp<*>,
  knownDevices: DeviceLike[],
  addKnownDevice: DeviceLike => *,
};

type Device = {
  id: string,
  name: string,
};

type Status = "scanning" | "pairing" | "genuinecheck" | "paired" | "timedout";

type State = {
  status: Status,
  device: ?Device,
  error: ?Error,
};

class PairDevices extends Component<Props, State> {
  static navigationOptions = ({ navigation }: *) => ({
    title: "Choose your device",
    headerRight: (
      <HeaderRightClose navigation={navigation.dangerouslyGetParent()} />
    ),
  });

  state = {
    status: "scanning",
    device: null,
    error: null,
  };

  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
  }

  onTimeout = () => {
    this.setState({ status: "timedout" });
  };

  onRetry = () => {
    this.setState({ status: "scanning", error: null, device: null });
  };

  onError = (error: Error) => {
    this.setState({ error });
  };

  onSelect = async (device: Device) => {
    this.setState({ device, status: "pairing" });
    try {
      const transport = await TransportBLE.open(device);
      if (this.unmounted) return;
      transport.setDebugMode(true);
      try {
        // getDeviceName is a dummy apdu to trigger the pairing.
        // at same time we might want to use its result to make sure the name is in sync!
        await getDeviceName(transport);
        this.setState({ device, status: "genuinecheck" });
        await genuineCheck(transport);
        if (this.unmounted) return;
        this.props.addKnownDevice(device);
        if (this.unmounted) return;
        this.setState({ status: "paired" });
      } finally {
        transport.close();
      }
    } catch (error) {
      if (this.unmounted) return;
      this.onError(error);
    }
  };

  onDone = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { error, status, device } = this.state;

    if (error) {
      // $FlowFixMe
      if (error.errorCode === BleErrorCode.LocationServicesDisabled) {
        return <LocationRequired />;
      }

      return (
        // FIXME identify how this is possible & what we should really do
        <LText>
          <TranslatedError error={error} />
        </LText>
      );
    }

    return (
      <View style={styles.root}>
        {status === "scanning" ? (
          <Scanning
            onSelect={this.onSelect}
            onError={this.onError}
            onTimeout={this.onTimeout}
          />
        ) : status === "timedout" ? (
          <ScanningTimeout onRetry={this.onRetry} onCancel={this.onDone} />
        ) : status === "pairing" ? (
          <Pairing />
        ) : status === "genuinecheck" ? (
          <GenuineCheck />
        ) : status === "paired" && device ? (
          <Paired deviceId={device.id} onContinue={this.onDone} />
        ) : null}
      </View>
    );
  }
}

class Screen extends Component<Props, State> {
  static navigationOptions = ({ navigation }: *) => ({
    title: "Choose your device",
    headerLeft: null,
    headerRight: <HeaderRightClose navigation={navigation} />,
  });

  render() {
    return (
      <RequiresBLE>
        <PairDevices {...this.props} />
      </RequiresBLE>
    );
  }
}

export default connect(
  createStructuredSelector({
    knownDevices: knownDevicesSelector,
  }),
  {
    addKnownDevice,
  },
)(Screen);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
