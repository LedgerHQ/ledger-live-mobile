// @flow

import React, { Component } from "react";
import { TextInput, View } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import Button from "../components/Button";

export default class EditDeviceName extends Component<{
  navigation: NavigationScreenProp<*>,
}> {
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
    if (device !== name) {
      // TODO implement APDU to send this!
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
        <Button type="primary" title="Change name" onClick={this.onSubmit} />
      </View>
    );
  }
}
