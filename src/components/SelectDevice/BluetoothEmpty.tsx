import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";

import { Box, Button, Flex, Text } from "@ledgerhq/native-ui";
import { BluetoothMedium } from "@ledgerhq/native-ui/assets/icons";

import lottie from "../../screens/Onboarding/assets/nanoX/pairDevice/data.json";

import Animation from "../Animation";

type Props = {
  onPairNewDevice: () => void;
};

function BluetoothEmpty({ onPairNewDevice }: Props) {
  return (
    <>
      <View style={styles.imageContainer}>
        <Animation source={lottie} style={styles.image} />
      </View>
      <Flex alignItems={"center"} flexDirection={"row"} mb={6}>
        <BluetoothMedium size={24} color={"neutral.c100"} />
        <Box ml={6}>
          <Text variant={"large"} fontWeight={"semiBold"}>
            <Trans i18nKey="SelectDevice.bluetooth.title" />
          </Text>
          <Text variant={"body"} fontWeight={"medium"}>
            <Trans i18nKey="SelectDevice.bluetooth.label" />
          </Text>
        </Box>
      </Flex>
      <Button event="PairDevice" type="main" onPress={onPairNewDevice}>
        <Trans i18nKey="SelectDevice.deviceNotFoundPairNewDevice" />
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    minHeight: 200,
    position: "relative",
    overflow: "visible",
  },
  image: {
    position: "absolute",
    left: "5%",
    top: 0,
    width: "110%",
    height: "100%",
  },
});

export default memo<Props>(BluetoothEmpty);
