// @flow
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import colors from "../colors";
import LText from "./LText";
import Animation from "./Animation";
import getDeviceAnimation from "./DeviceAction/getDeviceAnimation";

type Props = {
  device: Device,
  message: any,
};

export default function ValidateOnDevice({ device, message }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.picture}>
            <Animation
              source={getDeviceAnimation({ device, key: "validate" })}
            />
          </View>
        </View>
        <LText style={styles.action}>
          {t("walletconnect.stepVerification.action")}
        </LText>
        <View style={styles.messageContainer}>
          <LText semiBold>{message.message}</LText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  innerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  messageContainer: {
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
  },
  picture: {
    marginBottom: 40,
  },
  action: {
    fontSize: 18,
    lineHeight: 27,
    textAlign: "center",
    marginBottom: 36,
  }
});
