// @flow

import React from "react";
import { View, StyleSheet } from "react-native";

import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import LText from "../LText";
import USBIcon from "../../icons/USB";

export default function USBEmpty() {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.lightLive, borderColor: colors.lightLive },
      ]}
    >
      <USBIcon />
      <LText semiBold style={styles.text} color="live">
        <Trans i18nKey="SelectDevice.usb" />
      </LText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 64,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
  },
  text: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
  },
});
