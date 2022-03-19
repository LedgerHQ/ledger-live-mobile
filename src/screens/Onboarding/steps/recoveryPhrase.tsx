import React, { useCallback } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ScreenName } from "../../../const";
import { DeviceNames } from "../types";
import Illustration from "../../../images/illustration/Illustration";
import BaseStepperView, {
  RestoreRecovery,
  RestoreRecoveryStep1,
  PinCode,
  PinCodeInstructions,
  ExistingRecovery,
  ExistingRecoveryStep1,
  ExistingRecoveryStep2,
} from "./setupDevice/scenes";
import { TrackScreen } from "../../../analytics";

// @TODO Replace
const images = {
  light: {
    RestoreRecovery: require("../../../images/illustration/Light/_067.png"),
    RestoreRecoveryStep1: require("../../../images/illustration/Light/_067.png"),
    PinCode: require("../../../images/illustration/Light/_062.png"),
    PinCodeInstructions: require("../../../images/illustration/Light/_062.png"),
    ExistingRecovery: require("../../../images/illustration/Light/_059.png"),
    ExistingRecoveryStep1: require("../../../images/illustration/Light/_061.png"),
    ExistingRecoveryStep2: require("../../../images/illustration/Light/_061.png"),
  },
  dark: {
    RestoreRecovery: require("../../../images/illustration/Dark/_067.png"),
    RestoreRecoveryStep1: require("../../../images/illustration/Dark/_067.png"),
    PinCode: require("../../../images/illustration/Dark/_062.png"),
    PinCodeInstructions: require("../../../images/illustration/Dark/_062.png"),
    ExistingRecovery: require("../../../images/illustration/Dark/_059.png"),
    ExistingRecoveryStep1: require("../../../images/illustration/Dark/_061.png"),
    ExistingRecoveryStep2: require("../../../images/illustration/Dark/_061.png"),
  },
};

type Metadata = {
  id: string;
  illustration: JSX.Element;
  drawer: null | { route: string; screen: string };
};
const metadata: Array<Metadata> = [
  {
    id: RestoreRecovery.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.RestoreRecovery}
        lightSource={images.light.RestoreRecovery}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: RestoreRecoveryStep1.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.RestoreRecoveryStep1}
        lightSource={images.light.RestoreRecoveryStep1}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
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
    id: ExistingRecovery.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.ExistingRecovery}
        lightSource={images.light.ExistingRecovery}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: ExistingRecoveryStep1.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.ExistingRecoveryStep1}
        lightSource={images.light.ExistingRecoveryStep1}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: ExistingRecoveryStep2.id,
    illustration: (
      <Illustration
        size={150}
        darkSource={images.dark.ExistingRecoveryStep2}
        lightSource={images.light.ExistingRecoveryStep2}
      />
    ),
    drawer: {
      route: ScreenName.OnboardingGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
];

const scenes = [
  RestoreRecovery,
  RestoreRecoveryStep1,
  PinCode,
  PinCodeInstructions,
  ExistingRecovery,
  ExistingRecoveryStep1,
  ExistingRecoveryStep2,
];

function OnboardingStepRecoveryPhrase() {
  const navigation = useNavigation();
  const route = useRoute<
    RouteProp<{ params: { deviceModelId: DeviceNames } }, "params">
  >();

  const { deviceModelId } = route.params;

  const nextPage = useCallback(() => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingPairNew, {
      ...route.params,
      showSeedWarning: false,
    });
  }, [navigation, route.params]);

  return (
    <>
      <TrackScreen category="Onboarding" name="RecoveryPhrase" />
      <BaseStepperView
        onNext={nextPage}
        steps={scenes}
        metadata={metadata}
        deviceModelId={deviceModelId}
      />
    </>
  );
}

export default OnboardingStepRecoveryPhrase;
