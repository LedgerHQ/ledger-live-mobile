import React, { useCallback } from "react";
import { Image, Linking } from "react-native";
import { Trans } from "react-i18next";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Flex, Text, Link } from "@ledgerhq/native-ui";
import { ChevronBottomMedium } from "@ledgerhq/native-ui/assets/icons";

import Button from "../../../components/Button";
import { urls } from "../../../config/urls";
import { deviceNames } from "../../../wording";
import { useLocale } from "../../../context/Locale";
import { ScreenName } from "../../../const";
import InvertTheme from "../../../components/InvertTheme";

const illustration = require("../assets/v3/welcome/1.png");

const SafeFlex = styled(Flex).attrs({ as: SafeAreaView })``;

function OnboardingStepWelcome({ navigation }: any) {
  const buy = useCallback(() => Linking.openURL(urls.buyNanoX), []);

  const next = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingTermsOfUse);
  }, [navigation]);

  const onLanguageSelect = useCallback(
    () => navigation.navigate("OnboardingModal"),
    [navigation],
  );

  const { locale } = useLocale();

  return (
    <Flex flex={1}>
      <Flex
        backgroundColor="palette.primary.c60"
        justifyContent="center"
        alignItems="center"
        flex={1}
        overflow="hidden"
      >
        <Image source={illustration} resizeMode="contain" />
        <SafeFlex position="absolute" top={0} right={0}>
          <InvertTheme>
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
          </InvertTheme>
        </SafeFlex>
      </Flex>
      <Flex px={6} py={10}>
        <Text variant="h1" pb={5} style={{ textTransform: "uppercase" }}>
          <Trans i18nKey="v3.onboarding.stepWelcome.title" />
        </Text>
        <Text variant="body" color="palette.neutral.c80" pb={10}>
          <Trans i18nKey="v3.onboarding.stepWelcome.subtitle" />
        </Text>
        <Button
          type="primary"
          outline={false}
          event="Onboarding - Start"
          onPress={next}
          title={<Trans i18nKey="v3.onboarding.stepWelcome.start" />}
        />
        <Flex
          mt={7}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <Text variant="body">
            <Trans i18nKey="v3.onboarding.stepWelcome.noDevice" />{" "}
          </Text>
          <Link onPress={buy}>
            <Text variant="body" style={{ textDecorationLine: "underline" }}>
              <Trans
                i18nKey="v3.onboarding.stepWelcome.buy"
                values={deviceNames.nanoX}
              />
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default OnboardingStepWelcome;
