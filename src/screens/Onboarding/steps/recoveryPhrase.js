// @flow

import React, { useCallback } from "react";

import OnboardingStepperView from "../../../components/OnboardingStepperView";

import { recoveryPhraseScenes } from "../shared/infoPagesData";

const scenes = recoveryPhraseScenes;

function OnboardingStepRecoveryPhrase({ navigation, route }: *) {
  const next = useCallback(() => {}, []);

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
