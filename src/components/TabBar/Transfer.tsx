import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Pressable,
} from "react-native";
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

const AnimatedPressable = Animated.createAnimatedComponent(styled(Pressable)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
`);

const DURATION_MS = 250;
const Y_AMPLITUDE = 90;

const animParams = {
  duration: DURATION_MS,
  easing: Easing.inOut(Easing.ease),
  useNativeDriver: true,
};

export function TransferTabIcon() {
  const [isModalOpened, setIsModalOpened] = useState(false);
  // const [drawerHeight, setDrawerHeight] = useState(undefined);

  const openAnimValue = useRef(new Animated.Value(isModalOpened ? 1 : 0))
    .current;

  const { width, height: screenHeight } = Dimensions.get("screen");
  const { bottom: bottomInset } = useSafeAreaInsets();

  const translateY = openAnimValue.interpolate({
    inputRange: [0, 1],
    // outputRange: [drawerHeight ?? screenHeight, 0],
    outputRange: [Y_AMPLITUDE, 0],
  });

  const openModal = useCallback(() => {
    Animated.timing(openAnimValue, {
      toValue: 1,
      ...animParams,
    }).start(() => {
      setIsModalOpened(true);
    });
  }, [openAnimValue, setIsModalOpened]);

  const closeModal = useCallback(() => {
    setIsModalOpened(false);
    Animated.timing(openAnimValue, {
      toValue: 0,
      ...animParams,
    }).start();
  }, [openAnimValue, setIsModalOpened]);

  const onPressButton = useCallback(() => {
    isModalOpened ? closeModal() : openModal();
  }, [isModalOpened, closeModal, openModal]);

  // const handleDrawerLayout = useCallback(
  //   ({
  //     nativeEvent: {
  //       layout: { height },
  //     },
  //   }) => {
  //     setDrawerHeight(height);
  //   },
  //   [setDrawerHeight],
  // );

  const handleBackPress = useCallback(() => {
    if (!isModalOpened) return false;
    closeModal();
    return true;
  }, [isModalOpened, closeModal]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <>
      <AnimatedPressable
        pointerEvents={isModalOpened ? undefined : "box-none"}
        onPress={closeModal}
        style={{ opacity: openAnimValue }}
      />
      <AnimatedDrawerContainer
        pointerEvents={isModalOpened ? "box-none" : "none"}
        // onLayout={handleDrawerLayout}
        style={{
          transform: [
            {
              translateY,
            },
          ],
          opacity: openAnimValue,
          width,
          maxHeight: screenHeight - bottomInset,
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
