import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RenderTransitionProps } from "@ledgerhq/native-ui/components/Navigation/FlowStepper";
import {
  Flex,
  FlowStepper,
  Button,
  Icons,
  Transitions,
} from "@ledgerhq/native-ui";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenName } from "../../../../const";
import { DeviceNames } from "../../types";
import Illustration from "../../../../images/illustration/Illustration";
import Scene, {
  Intro,
  Instructions,
  PinCode,
  PinCodeInstructions,
  RecoveryPhrase,
  RecoveryPhraseInstructions,
  RecoveryPhraseSetup,
  HideRecoveryPhrase,
} from "./scenes";

const transitionDuration = 500;

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
      route: ScreenName.OnboardingModalSetupSteps,
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
      route: ScreenName.OnboardingModalGeneralInformation,
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
      route: ScreenName.OnboardingModalGeneralInformation,
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
      route: ScreenName.OnboardingModalGeneralInformation,
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
      screen: ScreenName.OnboardingSetupDeviceRecoveryPhrase,
    },
  },
];

const InfoButton = ({ target }: { target: Metadata["drawer"] }) => {
  const navigation = useNavigation();

  if (target)
    return (
      <Button
        Icon={Icons.InfoRegular}
        onPress={() =>
          // TODO: FIX @react-navigation/native using Typescript
          // @ts-ignore next-line
          navigation.navigate(target.route, { screen: target.screen })
        }
      />
    );

  return null;
};

const ImageHeader = ({
  activeIndex,
  onBack,
}: {
  activeIndex: number;
  onBack: () => void;
}) => {
  const stepData = metadata[activeIndex];

  return (
    <SafeAreaView
      style={[{ flex: 0.3 }, { backgroundColor: "hsla(248, 100%, 85%, 1)" }]}
    >
      <Flex flex={1} backgroundColor="primary.c60">
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          height={20}
        >
          <Button Icon={Icons.ArrowLeftMedium} onPress={onBack} />
          <InfoButton target={stepData.drawer} />
        </Flex>
        <Flex
          flex={1}
          mb={30}
          mx={8}
          justifyContent="center"
          alignItems="center"
        >
          {stepData.illustration}
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

const renderTransitionSlide = ({
  activeIndex,
  previousActiveIndex,
  status,
  duration,
  children,
}: RenderTransitionProps) => (
  <Transitions.Slide
    status={status}
    duration={duration}
    direction={(previousActiveIndex || 0) < activeIndex ? "left" : "right"}
    style={[StyleSheet.absoluteFill, { flex: 1 }]}
  >
    {children}
  </Transitions.Slide>
);

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
  const [index, setIndex] = React.useState(0);
  const navigation = useNavigation();
  const route = useRoute<
    RouteProp<{ params: { deviceModelId: DeviceNames } }, "params">
  >();

  const nextPage = useCallback(() => {
    if (index < scenes.length - 1) {
      setIndex(index + 1);
    } else {
      // TODO: FIX @react-navigation/native using Typescript
      // @ts-ignore next-line
      navigation.navigate(ScreenName.OnboardingPreQuizModal, {
        onNext: () =>
          navigation.navigate(ScreenName.OnboardingQuiz, { ...route.params }),
      });
    }
  }, [index, navigation, route.params]);

  const handleBack = React.useCallback(
    () =>
      index === 0 ? navigation.goBack : () => setIndex(index => index - 1),
    [index, navigation.goBack],
  );

  return (
    <Flex flex={1} width="100%" backgroundColor="background.main">
      <FlowStepper
        activeIndex={index}
        header={ImageHeader}
        renderTransition={renderTransitionSlide}
        transitionDuration={transitionDuration}
        progressBarProps={{ backgroundColor: "neutral.c40" }}
        extraProps={{ onBack: handleBack() }}
      >
        {scenes.map(Children => (
          <Scene key={Children.id}>{<Children onNext={nextPage} />}</Scene>
        ))}
      </FlowStepper>
    </Flex>
  );
}

export default OnboardingStepNewDevice;
