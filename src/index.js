//@flow
import "./polyfill";
import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import type Transport from "@ledgerhq/hw-transport";
import AppBtc from "@ledgerhq/hw-app-btc";
import findFirstTransport from "./findFirstTransport";

export default class App extends Component<{}, *> {
  state: {
    error: ?Error,
    result: *
  } = {
    error: null,
    result: null
  };

  sub: *;

  componentWillMount() {
    this.sub = findFirstTransport().subscribe(
      this.onTransport,
      this.onTransportError
    );
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  onTransport = (transport: *) => {
    console.log("transport:", transport);
    const appBtc = new AppBtc(transport);
    appBtc.getWalletPublicKey("44'/0'/0'/0").then(result => {
      this.setState({ result });
    });
  };

  onTransportError = (error: ?Error) => {
    this.setState({ error });
  };

  render() {
    const { error, result } = this.state;
    return (
      <View style={styles.container}>
        <Text>LEDGER WALLET</Text>
        <Text>{error ? error.toString() : null}</Text>
        <Text>{result ? result.bitcoinAddress : null}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
