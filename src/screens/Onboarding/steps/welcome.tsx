import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Flex, Text } from "@ledgerhq/native-ui";
import { ChevronBottomMedium } from "@ledgerhq/native-ui/assets/icons";
import Video from "react-native-video";

import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import Button from "../../../components/Button";
import { useLocale } from "../../../context/Locale";
import { ScreenName } from "../../../const";
import StyledStatusBar from "../../../components/StyledStatusBar";

const source = require("../../../../assets/videos/onboarding.mp4");

const absoluteStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  top: 0,
  right: 0,
};

const SafeFlex = styled(SafeAreaView)`
  padding-top: 24px;
`;

function OnboardingStepWelcome({ navigation }: any) {
  const next = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingTermsOfUse);
  }, [navigation]);

  const onLanguageSelect = useCallback(
    () => navigation.navigate(ScreenName.OnboardingLanguageModal),
    [navigation],
  );

  const { locale } = useLocale();

  return (
    <Flex flex={1} position="relative" bg="constant.black">
      <StyledStatusBar barStyle="light-content" />
      <Video
        source={source}
        style={absoluteStyle}
        muted
        repeat
        resizeMode={"cover"}
      />
      <Svg
        style={absoluteStyle}
        width="100%"
        height="120%"
        preserveAspectRatio="xMinYMin slice"
      >
        <Defs>
          <LinearGradient
            id="myGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="30%" stopOpacity={0} stopColor="black" />
            <Stop offset="100%" stopOpacity={0.8} stopColor="black" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#myGradient)" />
      </Svg>
      <Flex
        justifyContent="center"
        alignItems="center"
        flex={1}
        overflow="hidden"
      >
        <SafeFlex position="absolute" top={0} right={0}>
          <Button
            type="primary"
            size="small"
            mr={4}
            Icon={ChevronBottomMedium}
            iconPosition="right"
            title={locale.toLocaleUpperCase()}
            outline={false}
            onPress={onLanguageSelect}
          />
        </SafeFlex>
      </Flex>
      <Flex px={6} py={10}>
        <Text
          variant="h1"
          color="constant.white"
          pb={5}
          style={{ textTransform: "uppercase" }}
        >
          <Trans i18nKey="v3.onboarding.stepWelcome.title" />
        </Text>
        <Text variant="body" color="constant.white" pb={10}>
          <Trans i18nKey="v3.onboarding.stepWelcome.subtitle" />
        </Text>
        <Button
          type="primary"
          outline={false}
          event="Onboarding - Start"
          onPress={next}
          title={<Trans i18nKey="v3.onboarding.stepWelcome.start" />}
        />
      </Flex>
    </Flex>
  );
}

export default OnboardingStepWelcome;
