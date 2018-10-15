/* @flow */
import React, { Component } from "react";
import type { BigNumber } from "bignumber.js";
import invariant from "invariant";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { encodeURIScheme } from "@ledgerhq/live-common/lib/currencies";
import type { Currency } from "@ledgerhq/live-common/lib/types";

export default class QRCodePreview extends Component<{
  address: string,
  size: number,
  currency?: Currency,
  amount?: BigNumber,
  useURIScheme?: boolean,
}> {
  static defaultProps = {
    size: 200,
    useURIScheme: false,
  };

  render() {
    const { useURIScheme, address, currency, amount, size } = this.props;
    let value;
    if (useURIScheme) {
      invariant(currency, "when using URI scheme, currency is required");
      value = encodeURIScheme({ address, currency, amount });
    } else {
      value = address;
    }
    return (
      <View style={styles.root}>
        <QRCode
          size={size}
          value={value}
          logo={require("../images/qrledger.jpg")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    padding: 15,
    alignSelf: "center",
  },
});
