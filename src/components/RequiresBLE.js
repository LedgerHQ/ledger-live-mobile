// @flow
// renders children if BLE is available
// otherwise render an error

import React, { PureComponent, Component } from "react";
import { Observable } from "rxjs/Observable";
import { View, StyleSheet } from "react-native";
import TransportBLE from "../react-native-hw-transport-ble";
import LText from "./LText";
import RequiresLocationOnAndroid from "./RequiresLocationOnAndroid";

class NoBluetooth extends PureComponent<{ type: string }> {
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
    type: *,
  },
> {
  state = {
    type: "Unknown",
  };

  sub: *;

  componentDidMount() {
    this.sub = Observable.create(TransportBLE.observeState).subscribe({
      next: ({ type }) => type,
    });
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  render() {
    const { children } = this.props;
    const { type } = this.state;
    if (type === "Unknown") return null; // suspense PLZ
    if (type === "PoweredOn") {
      return children;
    }
    return (
      <View style={styles.container}>
        <NoBluetooth type={type} />
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
