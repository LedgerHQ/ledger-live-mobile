// @flow
import React, { useState, useCallback } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageProps,
  ImageSourcePropType,
} from "react-native";
import TorLogo from "./tor.png";

export default () => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Image
      source={TorLogo}
      resizeMode="contain"
      style={{ width: 70, height: 70, marginBottom: 32 }}
    />
    <Text style={styles.innerText}>{"Connecting to Tor Network..."}</Text>
  </View>
);

const styles = StyleSheet.create({
  baseText: {
    fontWeight: "bold",
  },
  innerText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
});
