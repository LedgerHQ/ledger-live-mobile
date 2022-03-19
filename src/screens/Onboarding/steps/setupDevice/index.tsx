import React, { useCallback } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { ScreenName } from "../../../../const";
import { DeviceNames } from "../../types";
import Illustration from "../../../../images/illustration/Illustration";
import BaseStepperView, {
  Intro,
  Instructions,
  PinCode,
  PinCodeInstructions,
  RecoveryPhrase,
  RecoveryPhraseInstructions,
  RecoveryPhraseSetup,
  HideRecoveryPhrase,
} from "./scenes";
import { TrackScreen } from "../../../../analytics";

// @TODO Replace
const images = {
  light: {
    Intro: require("../../../../images/illustration/Light/_052.png"),
    Instructions: require("../../../../images/illustration/Light/_052.png"),
    PinCode: require("../../../../images/illustration/Light/_062.png"),
    PinCodeInstructions: require("../../../../images/illustration/Light/_062.png"),
    RecoveryPhrase: require("../../../../images/illustration/Light/_061.png"),
    RecoveryPhraseInstructions: require("../../../../images/illustration/Light/_061.png"),
    RecoveryPhraseSetup: require("../../../../images/illustration/Light/_057.png"),
    HideRecoveryPhrase: require("../../../../images/illustration/Light/_057.png"),
  },
  dark: {
    Intro: require("../../../../images/illustration/Dark/_052.png"),
    Instructions: require("../../../../images/illustration/Dark/_052.png"),
    PinCode: require("../../../../images/illustration/Dark/_062.png"),
    PinCodeInstructions: require("../../../../images/illustration/Dark/_062.png"),
    RecoveryPhrase: require("../../../../images/illustration/Dark/_061.png"),
    RecoveryPhraseInstructions: require("../../../../images/illustration/Dark/_061.png"),
    RecoveryPhraseSetup: require("../../../../images/illustration/Dark/_057.png"),
    HideRecoveryPhrase: require("../../../../images/illustration/Dark/_057.png"),
  },
};

type Metadata = {
  id: string;
  illustration: JSX.Element;
  drawer: null | { route: string; screen: string };
};
const metadata: Array<Metadata> = [
  {
    id: Intro.id,
    // @TODO: Replace this placeholder with the correct illustration asap
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.Intro}
        lightSource={images.light.Intro}
      />
    ),
    drawer: null,
  },
  {
    id: Instructions.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.Instructions}
        lightSource={images.light.Instructions}
      />
    ),
    drawer: null,
  },
  {
    id: PinCode.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.PinCode}
        lightSource={images.light.PinCode}
      />
    ),
    drawer: null,
  },
  {
    id: PinCodeInstructions.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.PinCodeInstructions}
        lightSource={images.light.PinCodeInstructions}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingSetupDeviceInformation,
      screen: ScreenName.OnboardingSetupDeviceInformation,
    },
  },
  {
    id: RecoveryPhrase.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.RecoveryPhrase}
        lightSource={images.light.RecoveryPhrase}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: RecoveryPhraseInstructions.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.RecoveryPhraseInstructions}
        lightSource={images.light.RecoveryPhraseInstructions}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: RecoveryPhraseSetup.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.RecoveryPhraseSetup}
        lightSource={images.light.RecoveryPhraseSetup}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: HideRecoveryPhrase.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.HideRecoveryPhrase}
        lightSource={images.light.HideRecoveryPhrase}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingModalSetupSecureRecovery,
      screen: ScreenName.OnboardingModalSetupSecureRecovery,
    },
  },
];

const scenes = [
  Intro,
  Instructions,
  PinCode,
  PinCodeInstructions,
  RecoveryPhrase,
  RecoveryPhraseInstructions,
  RecoveryPhraseSetup,
  HideRecoveryPhrase,
];

function OnboardingStepNewDevice() {
  const navigation = useNavigation();
  const route = useRoute<
    RouteProp<{ params: { deviceModelId: DeviceNames } }, "params">
  >();

  const { deviceModelId } = route.params;

  const nextPage = useCallback(() => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingPreQuizModal, {
      onNext: () =>
        navigation.navigate(ScreenName.OnboardingQuiz, { ...route.params }),
    });
  }, [navigation, route.params]);

  return (
    <>
      <TrackScreen category="Onboarding" name="SetupNewDevice" />
      <BaseStepperView
        onNext={nextPage}
        steps={scenes}
        metadata={metadata}
        deviceModelId={deviceModelId}
      />
    </>
  );
}

export default OnboardingStepNewDevice;
