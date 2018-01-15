/* @flow */
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ScreenGeneric from "../components/ScreenGeneric";

export default class Settings extends Component<*> {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }: *) => (
      <Image
        source={require("../images/settings.png")}
        style={{ tintColor, width: 32, height: 32 }}
      />
    )
  };
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
    );
  };
  render() {
    return (
      <ScreenGeneric renderHeader={this.renderHeader}>
        <View style={styles.container} />
      </ScreenGeneric>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  headerText: {
    color: "white",
    fontSize: 16
  }
});
