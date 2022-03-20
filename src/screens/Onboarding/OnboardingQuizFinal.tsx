import React, { useCallback, useMemo, memo } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { ScreenName } from "../../const";
import HeaderIllustration from "./steps/HeaderIllustration";
import BaseStepperView, {
  QuizzFinal,
  Metadata,
} from "./steps/setupDevice/scenes";
import { TrackScreen } from "../../analytics";

import quizProSuccess from "../../images/illustration/Light/_053.png";
import quizProFail from "../../images/illustration/Light/_054.png";

const scenes = [QuizzFinal, QuizzFinal];

function OnboardingStepQuizFinal() {
  const navigation = useNavigation();
  const route = useRoute<
    RouteProp<
      {
        params: {
          success: boolean;
        };
      },
      "params"
    >
  >();

  const { success, deviceModelId } = route.params;

  const metadata: Array<Metadata> = useMemo(
    () => [
      {
        id: QuizzFinal.id,
        // @TODO: Replace this placeholder with the correct illustration asap
        illustration: (
          <HeaderIllustration source={success ? quizProSuccess : quizProFail} />
        ),
        drawer: null,
      },
    ],
    [success],
  );

  const nextPage = useCallback(() => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingPairNew, {
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
    </>
  );
}

export default memo(OnboardingStepQuizFinal);
