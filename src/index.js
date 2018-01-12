//@flow
import "./polyfill";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator
} from "react-native";
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
    const pending = !(error || result);
    return (
      <View style={styles.container}>
        <Text>LEDGER WALLET</Text>
        <View style={styles.body}>
          {pending ? <ActivityIndicator /> : null}
          <Text>{error ? error.toString() : null}</Text>
          <Text>{result ? result.bitcoinAddress : null}</Text>
        </View>
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
