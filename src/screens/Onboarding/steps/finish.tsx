// @flow

import React from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Video from "react-native-video";
import { Flex } from "@ledgerhq/native-ui";
import { LedgerLiveRegular } from "@ledgerhq/native-ui/assets/logos";
import { TrackScreen } from "../../../analytics";
import { completeOnboarding } from "../../../actions/settings";
import { useNavigationInterceptor } from "../onboardingContext";
import { NavigatorName } from "../../../const";

import { readOnlyModeEnabledSelector } from "../../../reducers/settings";
import Button from "../../../components/wrappedUi/Button";
import * as Animatable from "react-native-animatable";

const source = require("../../../../assets/videos/onboarding.mp4");
const poster = require("../../../../assets/videos/onboarding-poster.jpg");

type Props = {
  navigation: any;
};

export default function OnboardingStepFinish({ navigation }: Props) {
  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);
  const dispatch = useDispatch();
  const { resetCurrentStep } = useNavigationInterceptor();

  function onFinish(): void {
    dispatch(completeOnboarding());
    resetCurrentStep();

    const parentNav = navigation.getParent();
    if (parentNav) {
      parentNav.popToTop();
    }

    navigation.replace(NavigatorName.Base, {
      screen: NavigatorName.Main,
    });
  }

  return (
    <Flex flex={1} bg="constant.black">
      <Animatable.View
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          alignItems: "stretch",
          bottom: 0,
          right: 0,
        }}
        animation="fadeIn"
        delay={1000}
        duration={500}
      >
        <Video
          source={source}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            alignItems: "stretch",
            bottom: 0,
            right: 0,
            backgroundColor: "transparent",
          }}
          poster={poster?.uri}
          posterResizeMode={"cover"}
          repeat
          resizeMode={"cover"}
        />
      </Animatable.View>

      <Flex p={6} flex={1}>
        <TrackScreen category="Onboarding" name="Finish" />
        <Flex flex={1} justifyContent="center" alignItems="center">
          <LedgerLiveRegular width={"70%"} height={"20%"} color="white" />
        </Flex>
        <Button
          event="OnboardingFinish"
          testID="OnboardingFinish"
          type="main"
          onPress={onFinish}
        >
          <Trans i18nKey="onboarding.stepFinish.cta" />
        </Button>
      </Flex>
    </Flex>
  );
}
