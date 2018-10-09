// @flow

import React, { Component } from "react";
import { TextInput, View } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import LText from "../../components/LText";
import Button from "../../components/Button";
import HeaderRightClose from "../../components/HeaderRightClose";

export default class PairDevicesStep3 extends Component<{
  navigation: NavigationScreenProp<*>,
}> {
  static navigationOptions = ({ navigation }) => ({
    title: "Pairing success",
    headerRight: (
      <HeaderRightClose navigation={navigation.dangerouslyGetParent()} />
    ),
  });

  onEdit = () => {
    this.props.navigation.navigate("EditDeviceName", {
      // Not yet sure what we would pass here. maybe a uuid
    });
  };

  onPress = () => {
    this.props.navigation.dangerouslyGetParent().goBack();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <LText bold>SUCCESS</LText>
          <LText>bla bla bla</LText>
          <Button type="tertiary" title="Edit" onPress={this.onEdit} />
        </View>
        <Button type="primary" title="Continue" onPress={this.onPress} />
      </View>
    );
  }
}
