// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import OnboardingStepChooseDevice from "../../screens/Onboarding/steps/choose-device";
import OnboardingStepGetStarted from "../../screens/Onboarding/steps/get-started";
import OnboardingStepSetupPin from "../../screens/Onboarding/steps/setup-pin";
import OnboardingStepWriteRecovery from "../../screens/Onboarding/steps/write-recovery";
import OnboardingStepSecurityChecklist from "../../screens/Onboarding/steps/security-checklist";
import OnboardingStepPairNew from "../../screens/Onboarding/steps/pair-new";
import OnboardingStepPassword from "../../screens/Onboarding/steps/password";
import OnboardingStepShareData from "../../screens/Onboarding/steps/share-data";
import OnboardingStepScanQR from "../../screens/Onboarding/steps/scan-qr";
import OnboardingStepFinish from "../../screens/Onboarding/steps/finish";

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenName.OnboardingStepGetStarted}
        component={OnboardingStepGetStarted}
      />
      <Stack.Screen
        name={ScreenName.OnboardingStepChooseDevice}
        component={OnboardingStepChooseDevice}
      />
      <Stack.Screen
        name={ScreenName.OnboardingStepSetupPin}
        component={OnboardingStepSetupPin}
      />
      <Stack.Screen
        name={ScreenName.OnboardingStepWriteRecovery}
        component={OnboardingStepWriteRecovery}
      />
      <Stack.Screen
        name={ScreenName.OnboardingStepSecurityChecklist}
        component={OnboardingStepSecurityChecklist}
      />
      <Stack.Screen
        name={ScreenName.OnboardingStepPairNew}
        component={OnboardingStepPairNew}
      />
      <Stack.Screen
        name={ScreenName.OnboardingStepPassword}
        component={OnboardingStepPassword}
      />
      <Stack.Screen
        name={ScreenName.OnboardingStepShareData}
        component={OnboardingStepShareData}
      />
      <Stack.Screen
        name={ScreenName.OnboardingStepScanQR}
        component={OnboardingStepScanQR}
      />
      <Stack.Screen
        name={ScreenName.OnboardingStepFinish}
        component={OnboardingStepFinish}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
