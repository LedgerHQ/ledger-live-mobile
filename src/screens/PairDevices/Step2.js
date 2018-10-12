// @flow

import React, { Component } from "react";
import { View, FlatList } from "react-native";
import { Observable } from "rxjs";
import type { NavigationScreenProp } from "react-navigation";
import TransportBLE from "../../react-native-hw-transport-ble";
import LText from "../../components/LText";
import Button from "../../components/Button";
import HeaderRightClose from "../../components/HeaderRightClose";
import DeviceItem from "../../components/DeviceItem";

// In step 2, we assume the pre-check that BLE is on has been passed.
// yet we should always display errors properly. if you are on step2 and disable BLE,
// we should display the error but stay in step2.
// we can do this with the error that comes from the observable.
// it also seems the only easy way we can no Location is off.

type Props = {
  navigation: NavigationScreenProp<*>,
};

type State = {
  items: *[],
  bleError: ?Error,
  scanning: boolean,
  selectedDevice: ?*,
};

export default class PairDevicesStep2 extends Component<Props, State> {
  static navigationOptions = ({ navigation }: *) => ({
    title: "Choose your device",
    headerRight: (
      <HeaderRightClose navigation={navigation.dangerouslyGetParent()} />
    ),
  });

  state = {
    items: [],
    bleError: null,
    scanning: false,
    selectedDevice: null,
  };

  sub: *;

  componentDidMount() {
    this.startScan();
  }

  startScan = () => {
    // TODO there need to be a timeout that happen if no device are found in X seconds.

    this.setState({ scanning: true });

    this.sub = Observable.create(TransportBLE.listen).subscribe({
      complete: () => {
        this.setState({ scanning: false });
      },
      next: e => {
        if (e.type === "add") {
          const device = e.descriptor;
          this.setState(({ items }) => ({
            // FIXME seems like we have dup. ideally we'll remove them on the listen side!
            items: items.some(i => i.id === device.id)
              ? items
              : items.concat(device),
          }));
        }
      },
      error: bleError => {
        this.setState({ bleError, scanning: false });
      },
    });
  };

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe();
  }

  onSelect = (device: *) => {
    this.setState({ selectedDevice: device });
  };

  renderItem = ({ item }: { item: * }) => {
    const { selectedDevice } = this.state;
    return (
      <DeviceItem
        device={item}
        onSelect={this.onSelect}
        selected={selectedDevice ? item.id === selectedDevice.id : false}
      />
    );
  };

  keyExtractor = (item: *) => item.id;

  reload = async () => {
    if (this.sub) this.sub.unsubscribe();
    this.startScan();
  };

  onPress = () => {
    const { selectedDevice } = this.state;
    if (!selectedDevice) return;
    // for now we allow ourself to pass big object in navigation.
    // maybe in future, we should consider passing just UUID.
    // but it's unclear if BLE is efficient to recover a Device object.
    this.props.navigation.navigate("PairDevicesStep3", {
      device: selectedDevice,
    });
  };

  render() {
    const { items, bleError, selectedDevice } = this.state;

    if (bleError) {
      // TODO switch based on the error type & display proper error. use diff components
      return <LText>{bleError.message}</LText>;
    }

    // TODO implement pull to refresh to trigger a restart!

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={items}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
        <Button
          type="primary"
          title="Continue"
          onPress={this.onPress}
          disabled={!selectedDevice}
        />
      </View>
    );
  }
}
