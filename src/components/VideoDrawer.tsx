import React, { useState, useRef, useCallback, useEffect } from "react";
import { BaseModal, Flex, Text } from "@ledgerhq/native-ui";
import Video from "react-native-video";
import Button from "./wrappedUi/Button";
import StyleProvider from "../StyleProvider";
import { useTheme } from "styled-components/native";

const source = require("../../assets/videos/ledger-card.webm");
const light = require("../../assets/videos/NanoX_LL_White.webm");
const dark = require("../../assets/videos/NanoX_LL_black.webm");

const videos = {
  light,
  dark,
};

const modalStyleOverrides = {
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    minHeight: 0,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 24,
    paddingBottom: 24,
    maxHeight: "100%",
  },
};

export default function VideoDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <>
      <Button iconName="Stream" onPress={onOpen} type="color" size="large" />
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        modalStyle={modalStyleOverrides.modal}
        containerStyle={modalStyleOverrides.container}
        propagateSwipe={true}
      >
        <Flex height={200} position="relative">
          <Video
            source={videos[theme || "light"]}
            style={{
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              alignItems: "stretch",
              bottom: 0,
              right: 0,
              transform: [{ scale: 1.5 }],
              backgroundColor: "white",
            }}
            resizeMode={"cover"}
          />
        </Flex>
        <Flex mt={6} px={6} justifyContent="center" alignItems="stretch">
          <Text textAlign="center" variant="h2">
            Ledger NANO X
          </Text>
          <Text textAlign="center" variant="body">
            Next gen crypto security at your fingertips
          </Text>
          <Button mt={2} type="color" size="large">
            Continue
          </Button>
        </Flex>
      </BaseModal>
    </>
  );
}
