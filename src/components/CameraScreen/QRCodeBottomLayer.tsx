// @flow
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Trans } from "react-i18next";

import { Flex, Text, ProgressBar, Alert } from "@ledgerhq/native-ui";
import { rgba } from "../../colors";

import { softMenuBarHeight } from "../../logic/getWindowDimensions";

type Props = {
  progress?: number;
  liveQrCode?: boolean;
};

function QrCodeBottomLayer({ progress, liveQrCode }: Props) {
  return (
    <Flex
      style={[
        styles.darken,
        { backgroundColor: rgba("#142533", 0.4) },
        styles.centered,
      ]}
    >
      <Flex flex={1} alignItems="center" py={8} px={6}>
        <Text fontWeight="semiBold" variant="h3" color="constant.white">
          <Trans
            i18nKey={
              liveQrCode
                ? "v3.account.import.scan.descBottom"
                : "v3.send.scan.descBottom"
            }
          />
        </Text>
        {progress !== undefined && progress > 0 && (
          <Flex width={104} mt={8} alignItems="center">
            <ProgressBar
              length={100}
              index={Math.floor((progress || 0) * 100)}
            />
            <Text mt={6} variant="large" color="constant.white">
              {Math.floor((progress || 0) * 100)}%
            </Text>
          </Flex>
        )}
        <Flex flex={1} />
        <Alert
          type="info"
          title={
            <Flex>
              <Text fontWeight="semiBold" variant="body">
                <Trans i18nKey="v3.account.import.scan.descTop.line1" />
              </Text>
              <Text fontWeight="bold" variant="body">
                <Trans i18nKey="v3.account.import.scan.descTop.line2" />
              </Text>
            </Flex>
          }
        />
      </Flex>
    </Flex>
  );
}

const styles = StyleSheet.create({
  darken: {
    flexGrow: 1,
    paddingBottom: softMenuBarHeight(),
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#fff",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 16,
  },
});

export default memo<Props>(QrCodeBottomLayer);
