/* @flow */
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import colors from "../colors";

export default class ReceiveFunds extends Component<*> {
  static navigationOptions = {
    title: "Receive Funds"
  };
  render() {
    return (
      <View style={styles.root}>
        <QRCode
          size={160}
          value="https://ledgerwallet.com"
          logo={require("../images/qrledger.jpg")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.blue,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
