/* @flow */
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import SelectDevice from "../../components/SelectDevice";

class Manager extends Component<
  {
    navigation: NavigationScreenProp<*>,
  },
  {
    deviceId: ?string,
  },
> {
  static navigationOptions = {
    title: "Manager",
  };

  state = {
    deviceId: null,
  };

  onSelect = (deviceId: string) => {
    this.setState({ deviceId });
  };

  render() {
    // const { deviceId } = this.state;
    // if (deviceId) return <Main deviceId={deviceId} />;
    return (
      <View style={styles.root}>
        <SelectDevice onSelect={this.onSelect} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Manager;
