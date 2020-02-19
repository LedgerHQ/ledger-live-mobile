/* @flow */
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { TrackScreen } from "../../../analytics";
import LedgerSupportRow from "./LedgerSupportRow";
import ClearCacheRow from "./ClearCacheRow";
import HardResetRow from "./HardResetRow";
import ConfigureDeviceRow from "./ConfigureDeviceRow";

export default function HelpSettings() {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <TrackScreen category="Settings" name="Help" />
      <LedgerSupportRow />
      <ConfigureDeviceRow />
      <View style={styles.container}>
        <ClearCacheRow />
        <HardResetRow />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { paddingTop: 16, paddingBottom: 64 },
  container: {
    marginTop: 16,
  },
});
