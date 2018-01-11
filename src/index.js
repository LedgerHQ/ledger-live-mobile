//@flow
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BleManager } from "react-native-ble-plx";

const DefaultServiceUuid = "d973f2e0-b19e-11e2-9e96-0800200c9a66";
const DefaultWriteCharacteristicUuid = "d973f2e2-b19e-11e2-9e96-0800200c9a66";
const DefaultNotifyCharacteristicUuid = "d973f2e1-b19e-11e2-9e96-0800200c9a66";
const ClientCharacteristicConfig = "00002902-0000-1000-8000-00805f9b34fb";

export default class App extends Component<{}, *> {
  state: {
    bleError: ?Error
  } = {
    bleError: null
  };

  bleManager = new BleManager();
  bleSub: *;

  componentWillMount() {
    const { bleManager } = this;
    this.bleSub = bleManager.onStateChange(this.onBleStateChange, true);
  }

  componentWillUnmount() {
    if (this.bleSub) this.bleSub.remove();
    this.bleManager.stopDeviceScan();
  }

  onBleStateChange = (state: string) => {
    if (state === "PoweredOn") {
      this.scanAndConnect();
      if (this.bleSub) this.bleSub.remove();
    } else if (state === "Unsupported") {
      this.setState({
        bleError: new Error("Bluetooth BLE is not supported")
      });
    }
  };

  scanAndConnect() {
    this.bleManager.startDeviceScan(null, null, (bleError, device) => {
      if (bleError) {
        this.setState({ bleError });
        return;
      }
      console.log(
        device.name
      ); /*
      if (device.name === "U2F") {
        this.bleManager.stopDeviceScan();
        this.onDeviceFound(device);
      }*/
    });
  }

  async onDeviceFound(device: *) {
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      const services = await device.services();
      console.log(device, services);
      for (const service of services) {
        const characteristics = await service.characteristics();
        console.log(service, characteristics);
      }
    } catch (bleError) {
      this.setState({ bleError });
    }
  }

  render() {
    const { bleError } = this.state;
    return (
      <View style={styles.container}>
        <Text>LEDGER WALLET</Text>
        <Text>{bleError ? bleError.toString() : null}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
