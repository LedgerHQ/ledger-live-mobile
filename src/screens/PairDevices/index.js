// @flow

import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Observable } from "rxjs";
import type { NavigationScreenProp } from "react-navigation";
import { BleErrorCode } from "react-native-ble-plx";

import { addKnownDevice } from "../../actions/ble";
import { knownDevicesSelector } from "../../reducers/ble";
import type { DeviceLike } from "../../reducers/ble";
import TransportBLE from "../../react-native-hw-transport-ble";
import LText from "../../components/LText";
import Pairing from "./Pairing";
import Paired from "./Paired";
import LocationRequired from "../LocationRequired";
import HeaderRightClose from "../../components/HeaderRightClose";
import DeviceItem from "../../components/DeviceItem";
import BluetoothScanning from "./assets/BluetoothScanning";
import RequiresBLE from "../../components/RequiresBLE";
import colors from "../../colors";
import genuineCheck from "../../logic/hw/genuineCheck";

type Props = {
  navigation: NavigationScreenProp<*>,
  knownDevices: DeviceLike[],
  addKnownDevice: DeviceLike => *,
};

type Device = {
  id: string,
  name: string,
};

type Status = "scanning" | "scanned" | "pairing" | "paired" | "error";

type State = {
  status: Status,
  devices: Device[],
  device: ?Device,
  error: ?*,
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
    devices: [],
    device: null,
    error: null,
  };

  sub: *;

  componentDidMount() {
    this.startScan();
  }

  startScan = async () => {
    // TODO there need to be a timeout that happen if no device are found in X seconds.

    this.setState({ status: "scanning" });

    this.sub = Observable.create(TransportBLE.listen).subscribe({
      complete: () => {
        this.setState({ status: "scanned" });
      },
      next: e => {
        if (e.type === "add") {
          const device = e.descriptor;
          this.setState(({ devices }) => ({
            // FIXME seems like we have dup. ideally we'll remove them on the listen side!
            devices: devices.some(i => i.id === device.id)
              ? devices
              : devices.concat(device),
          }));
        }
      },
      error: error => {
        this.setState({ error, status: "error" });
      },
    });
  };

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe();
  }

  pairDevice = async () => {
    const { device } = this.state;
    if (!device) return;
    try {
      const transport = await TransportBLE.open(device);
      transport.setDebugMode(true);
      try {
        await genuineCheck(transport);
        this.props.addKnownDevice(device);
        this.setState({ status: "paired" });
      } finally {
        transport.close();
      }
    } catch (error) {
      this.setState({ status: "error", error });
    }
  };

  onSelect = (device: Device) => {
    if (this.sub) this.sub.unsubscribe();
    this.setState({ device, status: "pairing" }, this.pairDevice);
  };

  renderItem = ({ item }: { item: * }) => (
    <DeviceItem
      device={item}
      name={item.name}
      onSelect={this.onSelect}
      disabled={false}
      description={
        this.props.knownDevices.some(d => d.id === item.id)
          ? "known device"
          : ""
      }
    />
  );

  keyExtractor = (item: *) => item.id;

  reload = async () => {
    if (this.sub) this.sub.unsubscribe();
    this.startScan();
  };

  ListHeader = () => (
    // FIXME this is a component
    <View style={styles.listHeader}>
      <BluetoothScanning />
      <View style={styles.listHeaderTitleContainer}>
        <LText secondary bold style={styles.listHeaderTitleText}>
          We are searching for Nano X
        </LText>
      </View>
      <View style={styles.listHeaderSubtitleContainer}>
        <LText style={styles.listHeaderSubtitleText}>
          {
            "Please be sure power is on, you have enter your PIN and bluetooth is enabled"
          }
        </LText>
      </View>
    </View>
  );

  onDone = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { devices, error, status, device } = this.state;

    if (error) {
      if (error.errorCode === BleErrorCode.LocationServicesDisabled) {
        return <LocationRequired />;
      }

      return <LText>{error.message}</LText>;
    }

    return (
      <View style={styles.root}>
        {status === "scanning" || status === "scanned" ? (
          <FlatList
            style={styles.list}
            data={devices}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            ListHeaderComponent={() => (
              // FIXME this is a component
              <View style={styles.listHeader}>
                <BluetoothScanning
                  isAnimated={status === "scanning"}
                  isError={status === "scanned" && !devices.length}
                />
                <View style={styles.listHeaderTitleContainer}>
                  <LText secondary bold style={styles.listHeaderTitleText}>
                    We are searching for Nano X
                  </LText>
                </View>
                <View style={styles.listHeaderSubtitleContainer}>
                  <LText style={styles.listHeaderSubtitleText}>
                    {
                      "Please be sure power is on, you have enter your PIN and bluetooth is enabled"
                    }
                  </LText>
                </View>
              </View>
            )}
          />
        ) : status === "pairing" ? (
          <Pairing />
        ) : status === "paired" && device ? (
          <Paired device={device} onContinue={this.onDone} />
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
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listHeader: {
    paddingVertical: 32,
    alignItems: "center",
  },
  listHeaderTitleContainer: {
    marginTop: 24,
  },
  listHeaderTitleText: {
    color: colors.darkBlue,
    fontSize: 18,
  },
  listHeaderSubtitleContainer: {
    maxWidth: 288,
    marginTop: 8,
  },
  listHeaderSubtitleText: {
    textAlign: "center",
    fontSize: 14,
    color: colors.grey,
  },
});
