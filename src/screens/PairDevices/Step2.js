// @flow

import React, { Component } from "react";
import { View } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import LText from "../../components/LText";
import Button from "../../components/Button";
import HeaderRightClose from "../../components/HeaderRightClose";

export default class PairDevicesStep2 extends Component<{
  navigation: NavigationScreenProp<*>,
}> {
  static navigationOptions = ({ navigation }) => ({
    title: "Choose your device",
    headerRight: (
      <HeaderRightClose navigation={navigation.dangerouslyGetParent()} />
    ),
  });

  onPress = () => {
    this.props.navigation.navigate("PairDevicesStep3");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <LText style={{ padding: 20 }}>
            to implement this: just inspire from DebugBLE. we would just reuse
            the same thing. If there is no devices found after a timeout of like
            30s, we would stop the search and display the error.
          </LText>
        </View>
        <Button type="primary" title="Continue" onPress={this.onPress} />
      </View>
    );
  }
}
