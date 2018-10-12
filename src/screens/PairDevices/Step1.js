// @flow

import React, { Component } from "react";
import { View } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import Button from "../../components/Button";
import HeaderRightClose from "../../components/HeaderRightClose";
import RequiresBLE from "../../components/RequiresBLE";
import LText from "../../components/LText";

export default class PairDevicesStep1 extends Component<{
  navigation: NavigationScreenProp<*>,
}> {
  static navigationOptions = ({ navigation }: *) => ({
    title: "Pair a new device",
    headerRight: (
      <HeaderRightClose navigation={navigation.dangerouslyGetParent()} />
    ),
  });

  onPress = () => {
    this.props.navigation.navigate("PairDevicesStep2");
  };

  render() {
    return (
      <RequiresBLE>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <LText bold>Power up your Ledger Device blablabla</LText>
            <LText semiBold>
              Do not impl design until validation on what process will really
              be...
            </LText>
          </View>
          <Button type="primary" title="Continue" onPress={this.onPress} />
        </View>
      </RequiresBLE>
    );
  }
}
