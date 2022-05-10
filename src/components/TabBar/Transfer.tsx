import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet } from "react-native";
import { Flex, Icons } from "@ledgerhq/native-ui";

import proxyStyled from "@ledgerhq/native-ui/components/styled";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import Touchable from "../Touchable";
import CreateModal from "./Create";
import { lockSubject } from "../RootNavigator/CustomBlockRouterNavigator";
import { MAIN_BUTTON_BOTTOM, MAIN_BUTTON_SIZE } from "./shared";

const TransferButton = proxyStyled(Touchable).attrs({
  backgroundColor: "primary.c90",
  height: MAIN_BUTTON_SIZE,
  width: MAIN_BUTTON_SIZE,
  borderRadius: MAIN_BUTTON_SIZE / 2,
})`
  border-radius: 40px;
  align-items: center;
  justify-content: center;
`;

const hitSlop = {
  top: 10,
  left: 25,
  right: 25,
  bottom: 25,
};

export default () => null;

const AnimatedDrawerContainer = Animated.createAnimatedComponent(
  styled(Flex).attrs({
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 0,
    backgroundColor: "background.main",
  })``,
);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TransferTabIcon() {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const openAnimValue = useRef(new Animated.Value(isModalOpened ? 1 : 0))
    .current;

  const openModal = useCallback(() => {
    Animated.timing(openAnimValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsModalOpened(true);
    });
  }, [openAnimValue, setIsModalOpened]);

  const closeModal = useCallback(() => {
    setIsModalOpened(false);
    Animated.timing(openAnimValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [openAnimValue, setIsModalOpened]);

  const onPressButton = useCallback(() => {
    console.log("isModalOpened", isModalOpened);
    isModalOpened ? closeModal() : openModal();
  }, [isModalOpened, closeModal, openModal]);

  const { width, height } = Dimensions.get("screen");
  const { bottom: bottomInset, top: topInset } = useSafeAreaInsets();

  const translateY = openAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  return (
    <>
      <AnimatedPressable
        pointerEvents={isModalOpened ? undefined : "box-none"}
        onPress={closeModal}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.6)",
          opacity: openAnimValue,
        }}
      />
      <AnimatedDrawerContainer
        pointerEvents="box-none"
        style={{
          transform: [
            {
              translateY,
            },
          ],
          opacity: openAnimValue,
          width,
          maxHeight: height - bottomInset,
          paddingBottom:
            bottomInset + 16 + MAIN_BUTTON_SIZE + MAIN_BUTTON_BOTTOM,
        }}
      >
        <CreateModal isOpened={isModalOpened} onClose={closeModal} />
      </AnimatedDrawerContainer>
      <TransferButton
        event="Transfer"
        disabled={lockSubject.getValue()}
        hitSlop={hitSlop}
        onPress={onPressButton}
        bottom={MAIN_BUTTON_BOTTOM + bottomInset}
      >
        <Icons.TransferMedium size={28} color={"palette.background.main"} />
      </TransferButton>
    </>
  );
}
