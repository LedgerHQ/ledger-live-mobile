import React, { useCallback } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ScreenName } from "../../../const";
import { DeviceNames } from "../types";
import LottieIllustration from "./LottieIllustration";
import BaseStepperView, { PairNew, ConnectNano } from "./setupDevice/scenes";
import { TrackScreen } from "../../../analytics";
import SeedWarning from "../shared/SeedWarning";
import Illustration from "../../../images/illustration/Illustration";

import nanoX from "../assets/nanoX/pairDevice/data.json";
import nanoS from "../assets/nanoS/plugDevice/data.json";
import nanoSP from "../assets/nanoSP/plugDevice/dark.json";

const images = {
  light: {
    Intro: require("../../../images/illustration/Light/_076.png"),
  },
  dark: {
    Intro: require("../../../images/illustration/Dark/_076.png"),
  },
};

const lottieAnims = {
  nanoX,
  nanoS,
  nanoSP,
};

type Metadata = {
  id: string;
  illustration: JSX.Element;
  drawer: null | { route: string; screen: string };
};

const scenes = [PairNew, ConnectNano];

function OnboardingStepPairNew() {
  const navigation = useNavigation();
  const route = useRoute<
    RouteProp<
      {
        params: {
          deviceModelId: DeviceNames;
          next: any;
          showSeedWarning: boolean;
        };
      },
      "params"
    >
  >();

  const { deviceModelId, showSeedWarning } = route.params;

  const metadata: Array<Metadata> = [
    {
      id: PairNew.id,
      // @TODO: Replace this placeholder with the correct illustration asap
      illustration: (
        <Illustration
          size={150}
          darkSource={images.dark.Intro}
          lightSource={images.light.Intro}
        />
      ),
      drawer: {
        route: ScreenName.OnboardingBluetoothInformation,
        screen: ScreenName.OnboardingBluetoothInformation,
      },
    },
    {
      id: ConnectNano.id,
      // @TODO: Replace this placeholder with the correct illustration asap
      illustration: <LottieIllustration lottie={lottieAnims[deviceModelId]} />,
      drawer: {
        route: ScreenName.OnboardingBluetoothInformation,
        screen: ScreenName.OnboardingBluetoothInformation,
      },
    },
  ];

  const nextPage = useCallback(() => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingFinish, {
      ...route.params,
    });
  }, [navigation, route.params]);

  return (
    <>
      <TrackScreen category="Onboarding" name="PairNew" />
      <BaseStepperView
        onNext={nextPage}
        steps={scenes}
        metadata={metadata}
        deviceModelId={deviceModelId}
      />
      {showSeedWarning ? <SeedWarning deviceModelId={deviceModelId} /> : null}
    </>
  );
}

export default OnboardingStepPairNew;
