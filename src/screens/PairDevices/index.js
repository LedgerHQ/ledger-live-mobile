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
import colors from "../../colors";
import LocationRequired from "../LocationRequired";
import LText from "../../components/LText";
import HeaderRightClose from "../../components/HeaderRightClose";
import RequiresBLE from "../../components/RequiresBLE";
import TranslatedError from "../../components/TranslatedError";
import Pairing from "./Pairing";
import Paired from "./Paired";
import Scanning from "./Scanning";

type Props = {
  navigation: NavigationScreenProp<*>,
  knownDevices: DeviceLike[],
  addKnownDevice: DeviceLike => *,
};

type Device = {
  id: string,
  name: string,
};

type Status = "scanning" | "pairing" | "paired";

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
          <Scanning onSelect={this.onSelect} onError={this.onError} />
        ) : status === "pairing" ? (
          <Pairing />
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
