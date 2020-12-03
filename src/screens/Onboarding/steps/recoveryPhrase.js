// @flow

import React, { useCallback } from "react";

import OnboardingStepperView from "../../../components/OnboardingStepperView";
import { ScreenName } from "../../../const";

import { recoveryPhraseScenes } from "../shared/infoPagesData";

const scenes = recoveryPhraseScenes;

function OnboardingStepRecoveryPhrase({ navigation, route }: *) {
  const next = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingPairNew, {
      ...route.params,
      next: ScreenName.OnboardingFinish,
    });
  }, [navigation, route.params]);

  return (
    <OnboardingStepperView
      scenes={scenes}
      navigation={navigation}
      route={route}
      onFinish={next}
    />
  );
}

export default OnboardingStepRecoveryPhrase;
