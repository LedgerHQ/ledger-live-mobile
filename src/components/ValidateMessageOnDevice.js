// @flow
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import type { TypedMessageData } from "@ledgerhq/live-common/lib/families/ethereum/types";
import type { MessageData } from "@ledgerhq/live-common/lib/hw/signMessage/types";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import LText from "./LText";
import Animation from "./Animation";
import getDeviceAnimation from "./DeviceAction/getDeviceAnimation";

type Props = {
  device: Device,
  message: TypedMessageData | MessageData,
  account: AccountLike,
};

export default function ValidateOnDevice({ device, message, account }: Props) {
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
          <LText style={styles.property}>
            {t("walletconnect.stepVerification.accountName")}
          </LText>
          <LText semiBold>{account.name}</LText>
        </View>
        {message?.hashes?.domainHash ? (
          <View style={styles.messageContainer}>
            <LText style={styles.property}>
              {t("walletconnect.domainHash")}
            </LText>
            <LText semiBold>{message?.hashes?.domainHash}</LText>
          </View>
        ) : null}
        {message?.hashes?.messageHash ? (
          <View style={styles.messageContainer}>
            <LText style={styles.property}>
              {t("walletconnect.messageHash")}
            </LText>
            <LText semiBold>{message?.hashes?.messageHash}</LText>
          </View>
        ) : null}
        {message?.hashes?.stringHash ? (
          <View style={styles.messageContainer}>
            <LText style={styles.property}>
              {t("walletconnect.stringHash")}
            </LText>
            <LText semiBold>{message?.hashes?.stringHash}</LText>
          </View>
        ) : null}
        <View style={styles.messageContainer}>
          <LText style={styles.property}>{t("walletconnect.message")}</LText>
          <LText semiBold>
            {message.message.domain
              ? JSON.stringify(message.message)
              : message.message}
          </LText>
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
    marginTop: 2,
  },
  property: {
    opacity: 0.5,
    marginBottom: 8,
  },
  picture: {
    marginBottom: 40,
  },
  action: {
    fontSize: 18,
    lineHeight: 27,
    textAlign: "center",
    marginBottom: 36,
  },
});
