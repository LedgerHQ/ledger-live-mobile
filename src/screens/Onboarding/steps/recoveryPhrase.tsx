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
import { ScreenName } from "../../../const";
import { DeviceNames } from "../types";
import { PlaceholderIllustrationTiny } from "./PlaceholderIllustration";
import Scene, {
  RestoreRecovery,
  RestoreRecoveryStep1,
  PinCode,
  PinCodeInstructions,
  ExistingRecovery,
  ExistingRecoveryStep1,
  ExistingRecoveryStep2,
} from "./setupDevice/scenes";

const transitionDuration = 500;

type Metadata = {
  id: string;
  illustration: JSX.Element;
  drawer: null | { route: string; screen: string };
};
const metadata: Array<Metadata> = [
  {
    id: RestoreRecovery.id,
    illustration: <PlaceholderIllustrationTiny />,
    drawer: {
      route: ScreenName.OnboardingModalGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: RestoreRecoveryStep1.id,
    illustration: <PlaceholderIllustrationTiny />,
    drawer: {
      route: ScreenName.OnboardingModalGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: PinCode.id,
    illustration: <PlaceholderIllustrationTiny />,
    drawer: null,
  },
  {
    id: PinCodeInstructions.id,
    illustration: <PlaceholderIllustrationTiny />,
    drawer: {
      route: ScreenName.OnboardingModalSetupSteps,
      screen: ScreenName.OnboardingSetupDeviceInformation,
    },
  },
  {
    id: ExistingRecovery.id,
    illustration: <PlaceholderIllustrationTiny />,
    drawer: {
      route: ScreenName.OnboardingModalGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: ExistingRecoveryStep1.id,
    illustration: <PlaceholderIllustrationTiny />,
    drawer: {
      route: ScreenName.OnboardingModalGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
    },
  },
  {
    id: ExistingRecoveryStep2.id,
    illustration: <PlaceholderIllustrationTiny />,
    drawer: {
      route: ScreenName.OnboardingModalGeneralInformation,
      screen: ScreenName.OnboardingGeneralInformation,
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
  RestoreRecovery,
  RestoreRecoveryStep1,
  PinCode,
  PinCodeInstructions,
  ExistingRecovery,
  ExistingRecoveryStep1,
  ExistingRecoveryStep2,
];

function OnboardingStepRecoveryPhrase() {
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
      navigation.navigate(ScreenName.OnboardingPairNew, {
        ...route.params,
        showSeedWarning: false,
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

export default OnboardingStepRecoveryPhrase;
