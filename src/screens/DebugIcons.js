// @flow

import React, { Component } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-navigation";
import { UserRefusedAddress } from "@ledgerhq/live-common/lib/errors";
import colors from "../colors";
import DeviceNanoAction from "../icons/DeviceNanoAction";

class DebugIcons extends Component<{}> {
  static navigationOptions = {
    title: "Debug Icons",
  };

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView>
          <DeviceNanoAction />
          <DeviceNanoAction screen="validation" action />
          <DeviceNanoAction screen="home" />
          <DeviceNanoAction powerAction />
          <DeviceNanoAction error={new UserRefusedAddress()} />
          <DeviceNanoAction error={new Error("whatever")} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default DebugIcons;
