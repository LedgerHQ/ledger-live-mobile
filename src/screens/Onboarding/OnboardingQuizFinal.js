// @flow
import React from "react";
import { Trans } from "react-i18next";
import { Image, StyleSheet } from "react-native";
import OnboardingStepperView from "../../components/OnboardingStepperView";
import onboardingQuizFinalIllustration from "./assets/onboardingQuizFinal.png";

const OnboardingQuizFinal = ({ navigation, route }: *) => {
  const { success } = route.params;

  const scene = [
    {
      id: "quizFinal",
      type: "primary",
      sceneProps: {
        title: (
          <Trans
            i18nKey={`onboarding.quizz.final.${
              success ? "successTitle" : "failTitle"
            }`}
          />
        ),
        ctaText: <Trans i18nKey="onboarding.quizz.final.cta" />,
        descs: [
          <Trans
            i18nKey={`onboarding.quizz.final.${
              success ? "successText" : "failText"
            }`}
          />,
        ],
        children: (
          <Image
            style={styles.image}
            source={onboardingQuizFinalIllustration}
            resizeMode="cover"
          />
        ),
      },
    },
  ];

  return (
    <OnboardingStepperView
      scenes={scene}
      navigation={navigation}
      route={route}
      onFinish={() => {}}
      hideBackButton
      hideStepper
    />
  );
};

const styles = StyleSheet.create({
  image: {
    opacity: 0.5,
  },
});

export default OnboardingQuizFinal;
