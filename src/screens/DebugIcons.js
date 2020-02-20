// @flow

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserRefusedAddress } from "@ledgerhq/errors";
import colors from "../colors";
import DeviceNanoAction from "../components/DeviceNanoAction";

const forceInset = { bottom: "always" };

export default function DebugIcons() {
  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <DeviceNanoAction width={250} />
        <DeviceNanoAction width={250} action="accept" screen="validation" />
        <DeviceNanoAction width={250} screen="home" />
        <DeviceNanoAction width={250} action="left" screen="empty" wired />
        <DeviceNanoAction width={250} action="accept" screen="pin" />
        <DeviceNanoAction width={250} error={new UserRefusedAddress()} />
        <DeviceNanoAction width={250} error={new Error("wahtevr")} />
        <DeviceNanoAction width={250} wired />

        <DeviceNanoAction width={250} modelId="nanoS" />
        <DeviceNanoAction
          width={250}
          modelId="nanoS"
          error={new Error("wahtevr")}
        />
        <DeviceNanoAction
          width={250}
          modelId="nanoS"
          error={new UserRefusedAddress()}
        />
        <DeviceNanoAction
          width={250}
          modelId="nanoS"
          wired
          action="accept"
          screen="validation"
        />
        <DeviceNanoAction width={250} modelId="nanoS" wired action="left" />
        <DeviceNanoAction
          width={250}
          modelId="nanoS"
          wired
          screen="home"
          action="accept"
        />
        <DeviceNanoAction width={250} modelId="nanoS" wired screen="pin" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    alignItems: "center",
  },
});
