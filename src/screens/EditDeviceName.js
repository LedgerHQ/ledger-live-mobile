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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <TextInput value="current_name" style={{ padding: 10 }} />
        </View>
        <Button type="primary" title="Change name" />
      </View>
    );
  }
}
