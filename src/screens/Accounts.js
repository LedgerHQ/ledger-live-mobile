/* @flow */
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ScreenGeneric from "../components/ScreenGeneric";
import RequestDevice from "../components/RequestDevice";
import colors from "../colors";
import AppBtc from "@ledgerhq/hw-app-btc";

export default class Accounts extends Component<*, *> {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }: *) => (
      <Image
        source={require("../images/accounts.png")}
        style={{ tintColor, width: 32, height: 32 }}
      />
    )
  };
  state: { bitcoinAddress: ?string } = {
    bitcoinAddress: null
  };
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity>
          <Image
            source={require("../images/accountsmenu.png")}
            style={{ width: 24, height: 20 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Accounts</Text>
        <TouchableOpacity>
          <Image
            source={require("../images/accountsplus.png")}
            style={{ width: 22, height: 21 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  onTransport = async (transport: *) => {
    const btc = new AppBtc(transport);
    const { bitcoinAddress } = await btc.getWalletPublicKey("44'/0'/0'/0");
    this.setState({ bitcoinAddress });
  };

  onTransportError = () => {};

  render() {
    const { bitcoinAddress } = this.state;
    return (
      <ScreenGeneric renderHeader={this.renderHeader}>
        <View style={styles.carouselCountainer} />
        <RequestDevice
          onTransport={this.onTransport}
          onTransportError={this.onTransportError}
        />
        <View style={{ height: 800 }}>
          <Text>{bitcoinAddress}</Text>
        </View>
      </ScreenGeneric>
    );
  }
}

const styles = StyleSheet.create({
  carouselCountainer: {
    height: 300,
    backgroundColor: colors.blue
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flex: 1
  },
  headerText: {
    color: "white",
    fontSize: 16
  }
});
