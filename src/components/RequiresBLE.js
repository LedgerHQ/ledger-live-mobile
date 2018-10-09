// @flow
// renders children if BLE is available
// otherwise render an error

import React, { PureComponent, Component } from "react";
import { View, StyleSheet } from "react-native";
import { BleManager } from "react-native-ble-plx";
import LText from "./LText";
import RequiresLocationOnAndroid from "./RequiresLocationOnAndroid";

class NoBluetooth extends PureComponent<{ state: string }> {
  render() {
    // NB based on the state we could have different wording?
    return (
      <View>
        <LText>Bluetooth required</LText>
      </View>
    );
  }
}

class RequiresBLE extends Component<
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
    if (state === "Unknown") return null; // suspense PLZ
    if (state === "PoweredOn") {
      return children;
    }
    return (
      <View style={styles.container}>
        <NoBluetooth state={state} />
      </View>
    );
  }
}

export default ({ children }: *) => (
  <RequiresLocationOnAndroid>
    <RequiresBLE>{children}</RequiresBLE>
  </RequiresLocationOnAndroid>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
