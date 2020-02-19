/* @flow */
import React from "react";
import { Trans } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../const";
import SettingsRow from "../../../components/SettingsRow";
import { useNavigationInterceptor } from "../../Onboarding/onboardingContext";

export default function ConfigureDeviceRow() {
  const { navigate } = useNavigation();
  const { setShowWelcome, setFirstTimeOnboarding } = useNavigationInterceptor();

  function onPress() {
    setShowWelcome(false);
    setFirstTimeOnboarding(false);
    navigate("OnboardingStepChooseDevice", {
      goingBackToScreen: ScreenName.HelpSettings,
    });
  }

  return (
    <SettingsRow
      event="ConfigureDeviceRow"
      title={<Trans i18nKey="settings.help.configureDevice" />}
      desc={<Trans i18nKey="settings.help.configureDeviceDesc" />}
      arrowRight
      onPress={onPress}
      alignedTop
    />
  );
}
