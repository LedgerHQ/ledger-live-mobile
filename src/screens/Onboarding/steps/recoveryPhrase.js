// @flow

import React, { useCallback, useMemo } from "react";

import OnboardingStepperView from "../../../components/OnboardingStepperView";
import { ScreenName } from "../../../const";

import { getRecoveryPhraseScenes } from "../shared/infoPagesData";
import SeedWarning from "../shared/SeedWarning";

function OnboardingStepRecoveryPhrase({ navigation, route }: *) {
  const next = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingPairNew, {
      ...route.params,
      next: ScreenName.OnboardingFinish,
    });
  }, [navigation, route.params]);

  const { deviceModelId, showSeedWarning } = route.params;

  const scenes = useMemo(() => getRecoveryPhraseScenes(deviceModelId), [
    deviceModelId,
  ]);

  return (
    <>
      <OnboardingStepperView
        scenes={scenes}
        navigation={navigation}
        route={route}
        onFinish={next}
      />
      {showSeedWarning ? <SeedWarning deviceModelId={deviceModelId} /> : null}
    </>
  );
}

export default OnboardingStepRecoveryPhrase;
