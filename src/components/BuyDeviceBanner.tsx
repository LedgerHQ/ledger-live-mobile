import React, { useCallback } from "react";
import {
  Image,
  ImageStyle,
  PixelRatio,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Flex, Text } from "@ledgerhq/native-ui";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ButtonProps } from "@ledgerhq/native-ui/components/cta/Button";
import Button from "./wrappedUi/Button";
import { ScreenName } from "../const";

import imgSource from "../images/illustration/Shared/_NanoXTop.png";

type Props = {
  topLeft?: JSX.Element | null;
  buttonLabel?: string;
  buttonSize?: ButtonProps["size"];
  event?: string;
  eventProperties?: Record<string, any>;
  style?: StyleProp<ViewStyle>;
  imageScale?: number;
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

const Container = styled(Flex).attrs({
  backgroundColor: "constant.purple",
  borderRadius: "8px",
  padding: 16,
  flexDirection: "row",
  alignItems: "flex-start",
})``;

/** Preset props for a big nano image */
export const IMAGE_PROPS_BIG_NANO = {
  imageScale: 1.5,
  imageStyle: {
    right: -10,
  },
};

/** Preset props for a small nano image */
export const IMAGE_PROPS_SMALL_NANO = {
  imageScale: 1,
  imageStyle: {
    bottom: -30,
  },
};

export default function BuyDeviceBanner({
  topLeft,
  buttonLabel,
  buttonSize = "medium",
  event,
  eventProperties,
  style,
  imageScale = 1.4,
  imageContainerStyle,
  imageStyle,
}: Props) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const handleOnPress = useCallback(() => {
    navigate(ScreenName.BuyDeviceScreen);
  }, [navigate]);

  const imgScale = imageScale / PixelRatio.get();

  return (
    <Container style={style}>
      <Flex flexDirection="column" alignItems="flex-start">
        {topLeft || (
          <Flex flexDirection="column" width="80%">
            <Text
              variant="h5"
              fontWeight="semiBold"
              color="constant.black"
              mb="8px"
            >
              {t("buyDevice.bannerTitle")}
            </Text>
            <Text
              variant="paragraph"
              fontWeight="medium"
              color="constant.black"
              mb="20px"
            >
              {t("buyDevice.bannerSubtitle")}
            </Text>
          </Flex>
        )}
        <Button
          onPress={handleOnPress}
          size={buttonSize}
          event={event}
          eventProperties={eventProperties}
          type="main"
          flexShrink={0}
        >
          {buttonLabel ?? t("buyDevice.bannerButtonTitle")}
        </Button>
      </Flex>
      <Flex flex={1} />
      <Flex
        position="absolute"
        right={0}
        bottom={0}
        borderRadius="8px"
        overflow="hidden"
        imageContainerStyle={imageContainerStyle}
      >
        <Image
          resizeMode="contain"
          style={[
            { height: 394 * imgScale, width: 242 * imgScale },
            imageStyle,
          ]}
          source={imgSource}
        />
      </Flex>
    </Container>
  );
}
