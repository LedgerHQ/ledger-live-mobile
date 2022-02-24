import React, { useCallback, useState } from "react";
import * as Animatable from "react-native-animatable";
import { useTranslation } from "react-i18next";
import { Flex, Carousel, Text, Link, Button } from "@ledgerhq/native-ui";
import { Icons } from "@ledgerhq/native-ui";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ScreenName } from "../../../const";
import Illustration from "../../../images/illustration/Illustration";

import type { DeviceNames } from "../types";

// @TODO Replace
const images = {
  light: [
    require("../../../images/illustration/Swap.light.png"),
    require("../../../images/illustration/Swap.light.png"),
    require("../../../images/illustration/Swap.light.png"),
    require("../../../images/illustration/Swap.light.png"),
    require("../../../images/illustration/Swap.light.png"),
  ],
  dark: [
    require("../../../images/illustration/Swap.dark.png"),
    require("../../../images/illustration/Swap.dark.png"),
    require("../../../images/illustration/Swap.dark.png"),
    require("../../../images/illustration/Swap.dark.png"),
    require("../../../images/illustration/Swap.dark.png"),
  ],
};

type CardType = { index: number, deviceModelId: DeviceNames };
const Card = ({ index /*, deviceModelId */ }: CardType) => {
  const { t } = useTranslation();


  return (
    <Flex flex={1} justifyContent="center" alignItems="center" px={20}>
      <Flex mb={10}>
        {
          images.dark[index] && images.light[index] ? <Illustration size={154} darkSource={images.dark[index]} darkSource={images.light[index]} /> : null
        }
        
      </Flex>
      <Text variant="h2" mb={3} style={{ textTransform: "uppercase" }}>
        {t(`v3.onboarding.stepNewDevice.${index}.title`)}
      </Text>
      <Text textAlign="center" variant="body">
        {t(`v3.onboarding.stepNewDevice.${index}.desc`)}
      </Text>
    </Flex>
  );
};

const FooterDiscoveryLink = ({ label }: { label: string }) => (
  <Link Icon={Icons.ArrowRightMedium} iconPosition="right">
    {label}
  </Link>
);

const FooterNextButton = ({ label }: { label: string }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const next = useCallback(() => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingSetNewDevice, { ...route.params });
  }, [navigation, route.params]);

  return (
  <Button type="main" size="large" onPress={next}>
    {label}
  </Button>
)};

const FooterActions = new Map();
FooterActions.set(0, FooterDiscoveryLink);
FooterActions.set(4, FooterNextButton);

const Footer = ({ index }: { index: number }) => {
  const { t } = useTranslation();

  const Component = FooterActions.get(index);
  if (!Component) return null;

  return (
    <Animatable.View animation="fadeIn" useNativeDriver>
      <Component label={t(`v3.onboarding.stepNewDevice.${index}.action`)} />
    </Animatable.View>
  );
};

type CurrentRouteType = RouteProp<
  { params: { deviceModelId: DeviceNames } },
  "params"
>;

function OnboardingStepNewDevice() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const route = useRoute<CurrentRouteType>();

  const { deviceModelId } = route.params;

  return (
    <Flex flex={1} backgroundColor="primary.c60">
      <Carousel onChange={setCurrentIndex}>
        {new Array(5).fill(null).map((_, index) => (
          <Card index={index} key={index} deviceModelId={deviceModelId} />
        ))}
      </Carousel>
      <Flex minHeight="13%" justifyContent="center" alignItems="center">
        <Footer index={currentIndex} />
      </Flex>
    </Flex>
  );
}

export default OnboardingStepNewDevice;
