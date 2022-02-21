import React, { useCallback } from "react";
import { StyleSheet, Animated } from "react-native";
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
import LottieIllustration from "./LottieIllustration";
import Scene, { PairNew, ConnectNano } from "./setupDevice/scenes";
import { TrackScreen } from "../../../analytics";
import SeedWarning from "../shared/SeedWarning";

import nanoX from "../assets/nanoX/pairDevice/data.json";
import nanoS from "../assets/nanoS/plugDevice/data.json";
import nanoSP from "../assets/nanoSP/plugDevice/dark.json";

const lottieAnims = {
  nanoX,
  nanoS,
  nanoSP,
};

const transitionDuration = 500;

type Metadata = {
  id: string;
  illustration: JSX.Element;
  drawer: null | { route: string; screen: string };
};

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
  metadata,
}: {
  activeIndex: number;
  onBack: () => void;
  metadata: Metadata;
}) => {
  const firstRender = React.useRef(true);
  const [stepData, setStepData] = React.useState(metadata[activeIndex]);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const fadeIn = React.useMemo(
    () =>
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: transitionDuration,
        useNativeDriver: true,
      }),
    [fadeAnim],
  );
  const fadeOut = React.useMemo(
    () =>
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: transitionDuration,
        useNativeDriver: true,
      }),
    [fadeAnim],
  );

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    fadeOut.start(({ finished }) => {
      if (!finished) return;
      setStepData(metadata[activeIndex]);
      fadeIn.start();
    });

    return () => {
      fadeAnim.stopAnimation();
    };
  }, [fadeAnim, fadeIn, fadeOut, activeIndex]);

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

const scenes = [PairNew, ConnectNano];

function OnboardingStepPairNew() {
  const [index, setIndex] = React.useState(0);
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

  const { deviceModelId, next, showSeedWarning } = route.params;

  const metadata: Array<Metadata> = [
    {
      id: PairNew.id,
      // @TODO: Replace this placeholder with the correct illustration asap
      illustration: <PlaceholderIllustrationTiny />,
      drawer: {
        route: ScreenName.OnboardingModalGeneralInformation,
        screen: ScreenName.OnboardingBluetoothInformation,
      },
    },
    {
      id: ConnectNano.id,
      // @TODO: Replace this placeholder with the correct illustration asap
      illustration: <LottieIllustration lottie={lottieAnims[deviceModelId]} />,
      drawer: {
        route: ScreenName.OnboardingModalGeneralInformation,
        screen: ScreenName.OnboardingBluetoothInformation,
      },
    },
  ];

  const nextPage = useCallback(() => {
    if (index < scenes.length - 1) {
      setIndex(index + 1);
    } else {
      // TODO: FIX @react-navigation/native using Typescript
      // @ts-ignore next-line
      navigation.navigate(ScreenName.OnboardingFinish, {
        ...route.params,
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
      <TrackScreen category="Onboarding" name="PairNew" />
      <FlowStepper
        activeIndex={index}
        header={props => <ImageHeader {...props} metadata={metadata} />}
        renderTransition={renderTransitionSlide}
        transitionDuration={transitionDuration}
        progressBarProps={{ backgroundColor: "neutral.c40" }}
        extraProps={{ onBack: handleBack() }}
      >
        {scenes.map(Children => (
          <Scene key={Children.id}>
            {<Children onNext={nextPage} deviceModelId={deviceModelId} />}
          </Scene>
        ))}
      </FlowStepper>
      {showSeedWarning ? <SeedWarning deviceModelId={deviceModelId} /> : null}
    </Flex>
  );
}

export default OnboardingStepPairNew;
