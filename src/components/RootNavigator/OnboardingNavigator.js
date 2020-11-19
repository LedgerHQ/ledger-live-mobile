// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, NavigatorName } from "../../const";
import PasswordAddFlowNavigator from "./PasswordAddFlowNavigator";

import OnboardingWelcome from "../../screens/Onboarding/steps/welcome";
import styles from "../../navigation/styles";

/** OnboardingLanguage: "OnboardingLanguage",
  OnboardingTermsOfUse: "OnboardingTermsOfUse",
  OnboardingDeviceSelection: "OnboardingDeviceSelection",
  OnboardingUseCaseSelection: "OnboardingUseCaseSelection", */

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: styles.headerNoShadow }}>
      <Stack.Screen
        name={ScreenName.OnboardingWelcome}
        component={OnboardingWelcome}
      />
      <Stack.Screen
        name={ScreenName.OnboardingLanguage}
        component={OnboardingWelcome}
      />
      <Stack.Screen
        name={ScreenName.OnboardingTermsOfUse}
        component={OnboardingWelcome}
      />
      <Stack.Screen
        name={ScreenName.OnboardingDeviceSelection}
        component={OnboardingWelcome}
      />
      <Stack.Screen
        name={ScreenName.OnboardingUseCaseSelection}
        component={OnboardingWelcome}
      />

      <Stack.Screen
        name={NavigatorName.PasswordAddFlow}
        component={PasswordAddFlowNavigator}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
