import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Flex, Text } from "@ledgerhq/native-ui";
import { ChevronBottomMedium } from "@ledgerhq/native-ui/assets/icons";
import Video from "react-native-video";

import Button from "../../../components/Button";
import { useLocale } from "../../../context/Locale";
import { ScreenName } from "../../../const";

const source = require("../../../../assets/videos/onboarding.mp4");
const poster = require("../../../../assets/videos/onboarding-poster.jpg");

const SafeFlex = styled(SafeAreaView)`
  padding-top: 24px;
`;

function OnboardingStepWelcome({ navigation }: any) {
  const next = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingTermsOfUse);
  }, [navigation]);

  const onLanguageSelect = useCallback(
    () => navigation.navigate("OnboardingModal"),
    [navigation],
  );

  const { locale } = useLocale();

  return (
    <Flex flex={1} bg="palette.primary.c60">
      <Video
        source={source}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          alignItems: "stretch",
          bottom: 0,
          right: 0,
          backgroundColor: "transparent",
        }}
        poster={poster?.uri}
        posterResizeMode={"cover"}
        repeat
        resizeMode={"cover"}
      />
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
