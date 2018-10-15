// @flow
// renders children if Location is available
// otherwise render an error

import React, { PureComponent, Component } from "react";
import { View, StyleSheet, PermissionsAndroid } from "react-native";
import LText from "../LText";

class NoLocation extends PureComponent<{}> {
  render() {
    return (
      <View>
        <LText>Location required</LText>
      </View>
    );
  }
}

const permission = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

// FIXME this only detect the permission. not if location is enabled at runtime –_–

export default class RequiresBLE extends Component<
  {
    children: *,
  },
  {
    state: *,
  },
> {
  state = {
    state: null,
  };

  componentDidMount() {
    this.request();
  }

  request = async () => {
    this.setState({
      state: await PermissionsAndroid.request(permission, {
        title: "Location is required for Bluetooth BLE",
        message:
          "on Android, Location permission is required to being able to list Bluetooth BLE devices.",
      }),
    });
  };

  render() {
    const { children } = this.props;
    const { state } = this.state;
    if (!state) return null; // suspense PLZ
    if (state === PermissionsAndroid.RESULTS.GRANTED) {
      return children;
    }
    return (
      <View style={styles.container}>
        <NoLocation />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
