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
import Illustration from "../../../images/illustration/Illustration";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigatorName, ScreenName } from "../../../const";
import { DeviceNames } from "../types";
import Scene, { SyncDesktop } from "./setupDevice/scenes";
import { TrackScreen } from "../../../analytics";

const images = {
  light: {
    Intro: require("../../../images/illustration/Light/_074.png"),
  },
  dark: {
    Intro: require("../../../images/illustration/Dark/_074.png"),
  },
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

const scenes = [SyncDesktop, SyncDesktop];

function OnboardingStepPairNew() {
  const [index, setIndex] = React.useState(0);
  const navigation = useNavigation();
  const route = useRoute<
    RouteProp<
      {
        params: {
          deviceModelId: DeviceNames;
        };
      },
      "params"
    >
  >();

  const { deviceModelId } = route.params;

  const metadata: Array<Metadata> = [
    {
      id: SyncDesktop.id,
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
  ];

  const onNext = useCallback(() => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(NavigatorName.ImportAccounts, {
      screen: ScreenName.ScanAccounts,
      params: {
        onFinish: () => {
          // TODO: FIX @react-navigation/native using Typescript
          // @ts-ignore next-line
          navigation.navigate(ScreenName.OnboardingFinish, {
            ...route.params,
          });
        },
      },
    });
  }, [navigation, route.params]);

  const nextPage = useCallback(() => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingModalWarning, {
      screen: ScreenName.OnboardingModalSyncDesktopInformation,
      params: { onNext },
    });
  }, [navigation, onNext]);

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
        {scenes.map((Children, i) => (
          <Scene key={Children.id + i}>
            {<Children onNext={nextPage} deviceModelId={deviceModelId} />}
          </Scene>
        ))}
      </FlowStepper>
    </Flex>
  );
}

export default OnboardingStepPairNew;
