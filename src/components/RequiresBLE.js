// @flow
// renders children if BLE is available
// otherwise render an error

import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { BleManager } from "react-native-ble-plx";
import LText from "./LText";

export default class RequiresBLE extends Component<
  {
    children: *,
  },
  {
    state: *,
  },
> {
  state = {
    state: "Unknown",
  };

  manager = new BleManager();

  async componentDidMount() {
    this.manager.onStateChange(state => {
      this.setState({ state });
    });
    const state = await this.manager.state();
    this.setState({ state });
  }

  componentWillUnmount() {
    this.manager.destroy();
  }

  render() {
    const { children } = this.props;
    const { state } = this.state;
    if (state === "PoweredOn") {
      return children;
    }
    return (
      <View style={styles.container}>
        <LText strong style={{ padding: 20 }}>
          State is {state}
        </LText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
