// @flow

import React, { Component } from "react";
import { TextInput, View } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import TransportBLE from "../react-native-hw-transport-ble";
import Button from "../components/Button";

export default class EditDeviceName extends Component<
  {
    navigation: NavigationScreenProp<*>,
  },
  {
    name: string,
  },
> {
  static navigationOptions = {
    title: "Edit Device Name",
  };

  state = {
    name: this.props.navigation.getParam("device").name,
  };

  onChangeText = name => {
    this.setState({ name });
  };

  onSubmit = async () => {
    const { name } = this.state;
    const device = this.props.navigation.getParam("device");

    if (device.name !== name) {
      const transport = await TransportBLE.open(device);

      // Temporary BLE thingy for demoing rename,
      // should use real APDU in final release

      const formattedName = Buffer.concat([
        Buffer.alloc(1),
        Buffer.from(name),
      ]).toString("base64");

      await transport.connectCharacteristic.writeWithResponse(formattedName);
      transport.close();
    }
    this.props.navigation.goBack();
  };

  render() {
    const { name } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            value={name}
            onChangeText={this.onChangeText}
            style={{ padding: 10 }}
          />
        </View>
        <Button type="primary" title="Change name" onPress={this.onSubmit} />
      </View>
    );
  }
}
