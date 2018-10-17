// @flow

import React, { Component } from "react";
import { FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Observable } from "rxjs";

import { knownDevicesSelector } from "../../reducers/ble";
import type { DeviceLike } from "../../reducers/ble";
import TransportBLE from "../../react-native-hw-transport-ble";
import DeviceItem from "../../components/DeviceItem";
import ScanningHeader from "./ScanningHeader";

type Props = {
  knownDevices: DeviceLike[],
  onSelect: Device => *,
  onError: Error => *,
};

type Device = {
  id: string,
  name: string,
};

type State = {
  devices: Device[],
  pending: boolean,
};

class Scanning extends Component<Props, State> {
  state = {
    devices: [],
    pending: false,
  };

  sub: *;

  componentDidMount() {
    this.startScan();
  }

  startScan = async () => {
    // TODO there need to be a timeout that happen if no device are found in X seconds.

    this.setState({ pending: true });

    this.sub = Observable.create(TransportBLE.listen).subscribe({
      complete: () => {
        this.setState({ pending: false });
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
        this.props.onError(error);
      },
    });
  };

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe();
  }

  keyExtractor = (item: *) => item.id;

  reload = async () => {
    if (this.sub) this.sub.unsubscribe();
    this.startScan();
  };

  renderItem = ({ item }: { item: * }) => {
    const knownDevice = this.props.knownDevices.find(d => d.id === item.id);
    return (
      <DeviceItem
        device={item}
        name={item.name}
        onSelect={this.props.onSelect}
        disabled={!!knownDevice}
        description={knownDevice ? "Already paired" : ""}
      />
    );
  };

  ListHeader = () => {
    const { pending, devices } = this.state;
    // FIXME this is a component
    return (
      <ScanningHeader
        animating={pending}
        hasError={!pending && devices.length === 0}
      />
    );
  };

  render() {
    const { devices } = this.state;
    return (
      <FlatList
        style={styles.list}
        data={devices}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ListHeaderComponent={this.ListHeader}
      />
    );
  }
}

export default connect(
  createStructuredSelector({
    knownDevices: knownDevicesSelector,
  }),
)(Scanning);

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
