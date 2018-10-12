// @flow

import React, { Component } from "react";
import { TextInput, View } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import TransportBLE from "../react-native-hw-transport-ble";
import editDeviceName from "../logic/hw/editDeviceName";
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

  onChangeText = (name: string) => {
    this.setState({ name });
  };

  onSubmit = async () => {
    const { name } = this.state;
    const device = this.props.navigation.getParam("device");
    if (device.name !== name) {
      const transport = await TransportBLE.open(device);
      await editDeviceName(transport, name);
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
