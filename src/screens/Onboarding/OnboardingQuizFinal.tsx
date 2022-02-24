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
import { ScreenName } from "../../const";
import HeaderIllustration from "./steps/HeaderIllustration";
import Scene, { QuizzFinal } from "./steps/setupDevice/scenes";
import { TrackScreen } from "../../analytics";

import quizProSuccess from "./assets/quizPro1.png";
import quizProFail from "./assets/quizPro2.png";

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
  const [stepData] = React.useState(metadata[activeIndex]);

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

  const { success } = route.params;

  const metadata: Array<Metadata> = [
    {
      id: QuizzFinal.id,
      // @TODO: Replace this placeholder with the correct illustration asap
      illustration: (
        <HeaderIllustration source={success ? quizProSuccess : quizProFail} />
      ),
      drawer: null,
    },
  ];

  const nextPage = useCallback(() => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingPairNew, {
      ...route.params,
    });
  }, [navigation, route.params]);

  const handleBack = React.useCallback(() => navigation.goBack, [
    navigation.goBack,
  ]);

  return (
    <Flex flex={1} width="100%" backgroundColor="background.main">
      <TrackScreen category="Onboarding" name="PairNew" />
      <FlowStepper
        activeIndex={0}
        header={props => <ImageHeader {...props} metadata={metadata} />}
        renderTransition={renderTransitionSlide}
        transitionDuration={transitionDuration}
        progressBarProps={{ backgroundColor: "neutral.c40" }}
        extraProps={{ onBack: handleBack() }}
      >
        {scenes.map((Children, i) => (
          <Scene key={Children.id + i}>
            {<Children onNext={nextPage} success={success} />}
          </Scene>
        ))}
      </FlowStepper>
    </Flex>
  );
}

export default OnboardingStepQuizFinal;
