import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, BackHandler, Dimensions, Pressable } from "react-native";
import { Flex } from "@ledgerhq/native-ui";
import Lottie from "lottie-react-native";

import proxyStyled from "@ledgerhq/native-ui/components/styled";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled, { useTheme } from "styled-components/native";
import Touchable from "../Touchable";
import TransferDrawer from "./TransferDrawer";
import { lockSubject } from "../RootNavigator/CustomBlockRouterNavigator";
import { MAIN_BUTTON_BOTTOM, MAIN_BUTTON_SIZE } from "./shared";

import lightAnimSource from "../../animations/mainButton/light.json";
import darkAnimSource from "../../animations/mainButton/dark.json";

const MainButton = proxyStyled(Touchable).attrs({
  backgroundColor: "primary.c80",
  height: MAIN_BUTTON_SIZE,
  width: MAIN_BUTTON_SIZE,
  borderRadius: MAIN_BUTTON_SIZE / 2,
  overflow: "hidden",
})`
  border-radius: 40px;
  align-items: center;
  justify-content: center;
`;

const ButtonAnimation = proxyStyled(Lottie).attrs({
  height: MAIN_BUTTON_SIZE,
  width: MAIN_BUTTON_SIZE,
})``;

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
    borderTopRightRadius: "24px",
    borderTopLeftRadius: "24px",
  })``,
);

const BackdropPressable = Animated.createAnimatedComponent(styled(Pressable)`
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
  useNativeDriver: true,
};

const noAnimParams = {
  ...animParams,
  duration: 0,
};

/** Just for debugging */
const initialIsModalOpened = false;

export function TransferTabIcon() {
  const {
    colors: { type: themeType },
  } = useTheme();
  const [isModalOpened, setIsModalOpened] = useState(initialIsModalOpened);

  const openAnimValue = useRef(new Animated.Value(initialIsModalOpened ? 1 : 0))
    .current;

  const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
  const { bottom: bottomInset, top: topInset } = useSafeAreaInsets();

  const translateYAnimValue = openAnimValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [Y_AMPLITUDE, 0, Y_AMPLITUDE],
  });

  const lottieProgressAnimValue = openAnimValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 0.5, 1],
  });

  const opacityAnimValue = openAnimValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  const openModal = useCallback(() => {
    Animated.sequence([
      Animated.timing(openAnimValue, { toValue: 0, ...noAnimParams }),
      Animated.timing(openAnimValue, { toValue: 1, ...animParams }),
    ]).start(() => {
      setIsModalOpened(true);
    });
  }, [openAnimValue, setIsModalOpened]);

  const closeModal = useCallback(() => {
    setIsModalOpened(false);
    Animated.sequence([
      Animated.timing(openAnimValue, { toValue: 2, ...animParams }),
      Animated.timing(openAnimValue, { toValue: 0, ...noAnimParams }),
    ]).start();
  }, [openAnimValue, setIsModalOpened]);

  const onPressButton = useCallback(() => {
    isModalOpened ? closeModal() : openModal();
  }, [isModalOpened, closeModal, openModal]);

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
      <BackdropPressable
        pointerEvents={isModalOpened ? undefined : "box-none"}
        onPress={closeModal}
        style={{ opacity: opacityAnimValue }}
      />
      <AnimatedDrawerContainer
        pointerEvents={isModalOpened ? undefined : "none"}
        style={{
          transform: [
            {
              translateY: translateYAnimValue,
            },
          ],
          opacity: opacityAnimValue,
          width: screenWidth,
          maxHeight: screenHeight - bottomInset - topInset,
          paddingBottom:
            bottomInset + 16 + MAIN_BUTTON_SIZE + MAIN_BUTTON_BOTTOM,
        }}
      >
        <TransferDrawer isOpened={isModalOpened} onClose={closeModal} />
      </AnimatedDrawerContainer>
      <MainButton
        activeOpacity={1}
        event="Transfer"
        disabled={lockSubject.getValue()}
        hitSlop={hitSlop}
        onPress={onPressButton}
        bottom={MAIN_BUTTON_BOTTOM + bottomInset}
      >
        <ButtonAnimation
          source={themeType === "light" ? lightAnimSource : darkAnimSource}
          progress={lottieProgressAnimValue}
          loop={false}
        />
      </MainButton>
    </>
  );
}
