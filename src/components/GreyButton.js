/* @flow */

import React, { Component } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import colors from "../colors";

export default class FooterButton extends Component<*> {
  render() {
    const { onPress, title } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#aaa"
  },
  title: {
    color: "#aaa"
  }
});
