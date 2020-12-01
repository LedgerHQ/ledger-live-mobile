// @flow

import React, { useCallback } from "react";

import OnboardingStepperView from "../../../components/OnboardingStepperView";

import { setupDeviceScenes } from "../shared/infoPagesData";

const scenes = setupDeviceScenes;

function OnboardingStepNewDevice({ navigation, route }: *) {
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

export default OnboardingStepNewDevice;
