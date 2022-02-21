// @flow
import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import OnboardingView from "./OnboardingView";
import { ScreenName } from "../../const";
import { Flex, Button, Text } from "@ledgerhq/native-ui";
import quizProSuccess from "./assets/quizPro1.png";
import quizProFail from "./assets/quizPro2.png";
import { Image } from "react-native";

const images = {
  success: quizProSuccess,
  fail: quizProFail,
};

const OnboardingQuizFinal = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { success } = route.params;
  const { t } = useTranslation();

  const next = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingPairNew, {
      ...route.params,
      next: ScreenName.OnboardingFinish,
    });
  }, [navigation, route.params]);

  return (
    <OnboardingView
      hasBackButton
      centerTitle
      title={t(
        `v3.onboarding.quizz.final.${success ? "successTitle" : "failTitle"}`,
      )}
      footer={
        <Flex flexDirection="row" justifyContent="center">
          <Button onPress={next} type="main">
            {t("v3.onboarding.quizz.final.cta")}
          </Button>
        </Flex>
      }
    >
      <Flex>
        <Flex height={200}>
          <Image
            source={images[success ? "success" : "fail"]}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </Flex>
        <Text variant="h2">
          {t(`onboarding.quizz.final.${success ? "successText" : "failText"}`)}
        </Text>
      </Flex>
    </OnboardingView>
  );
};

export default OnboardingQuizFinal;
