import React, { useCallback, useState } from "react";
import * as Animatable from "react-native-animatable";
import { useTranslation } from "react-i18next";
import { Flex, Carousel, Text, Link, Button } from "@ledgerhq/native-ui";
import { Icons } from "@ledgerhq/native-ui";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import PlaceholderIllustration from "./PlaceholderIllustration";
import { ScreenName } from "../../../const";

import type { DeviceNames } from "../types";

type CardType = { index: number, deviceModelId: DeviceNames };
const Card = ({ index /*, deviceModelId */ }: CardType) => {
  const { t } = useTranslation();

  // TODO: use deviceModelId to dynamically render the device illustation
  // as soon as the illustration is ready

  return (
    <Flex flex={1} justifyContent="center" alignItems="center" px={20}>
      <Flex mb={10}>
        <PlaceholderIllustration />
      </Flex>
      <Text variant="h2" mb={3} style={{ textTransform: "uppercase" }}>
        {t(`onboarding.stepNewDevice.${index}.title`)}
      </Text>
      <Text textAlign="center" variant="body">
        {t(`onboarding.stepNewDevice.${index}.desc`)}
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
      <Component label={t(`onboarding.stepNewDevice.${index}.action`)} />
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
    // TODO: Replace this value with constant.purple as soon as the value is fixed in the theme
    <Flex flex={1} backgroundColor="hsla(248, 100%, 85%, 1)">
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
