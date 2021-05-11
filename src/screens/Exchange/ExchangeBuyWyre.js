// @flow

import React from "react";
import { View, StyleSheet } from "react-native";
import TrackScreen from "../../analytics/TrackScreen";
import LText from "../../components/LText";

export default function BuyWyre() {
  return (
    <>
      <TrackScreen category="Buy Crypto Wyre" />
      <View style={styles.body}>
        <LText semiBold style={{ fontSize: 18 }}>
          Webview
        </LText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
});
