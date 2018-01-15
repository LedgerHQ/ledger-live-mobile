//@flow
import "./polyfill";
import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import AppBtc from "@ledgerhq/hw-app-btc";
import RequestDevice from "./components/RequestDevice";

export default class App extends Component<{}, *> {
  state: {
    error: ?Error,
    result: *
  } = {
    error: null,
    result: null
  };

  onTransport = async (transport: *) => {
    console.log("transport:", transport);
    const appBtc = new AppBtc(transport);
    const result = await appBtc.getWalletPublicKey("44'/0'/0'/0");
    this.setState({ result });
  };

  onTransportError = (error: ?Error) => {
    this.setState({ error });
  };

  render() {
    const { error, result } = this.state;
    const pending = !(error || result);
    return (
      <View style={styles.container}>
        <Text>LEDGER WALLET</Text>
        <Text>{result ? result.bitcoinAddress : null}</Text>
        <RequestDevice
          onTransport={this.onTransport}
          onTransportError={this.onTransportError}
        />
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
  },
  body: {
    padding: 20
  }
});
