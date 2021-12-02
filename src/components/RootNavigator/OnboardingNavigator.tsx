import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
  StackNavigationOptions,
  StackScreenProps,
} from "@react-navigation/stack";
import { ScreenName, NavigatorName } from "../../const";
import PasswordAddFlowNavigator from "./PasswordAddFlowNavigator";

import OnboardingWelcome from "../../screens/Onboarding/steps/welcome";
import OnboardingLanguage, {
  OnboardingStepLanguageGetStarted,
} from "../../screens/Onboarding/steps/language";
import OnboardingTerms from "../../screens/Onboarding/steps/terms";
import OnboardingDeviceSelection from "../../screens/Onboarding/steps/deviceSelection";
import OnboardingUseCase from "../../screens/Onboarding/steps/useCaseSelection";
import OnboardingNewDeviceInfo from "../../screens/Onboarding/steps/newDeviceInfo";
import OnboardingNewDevice from "../../screens/Onboarding/steps/setupDevice";
import OnboardingRecoveryPhrase from "../../screens/Onboarding/steps/recoveryPhrase";
import OnboardingInfoModal from "../OnboardingStepperView/OnboardingInfoModal";

import OnboardingPairNew from "../../screens/Onboarding/steps/pairNew";
import OnboardingImportAccounts from "../../screens/Onboarding/steps/importAccounts";
import OnboardingFinish from "../../screens/Onboarding/steps/finish";
import OnboardingQuiz from "../../screens/Onboarding/OnboardingQuiz";
import OnboardingQuizFinal from "../../screens/Onboarding/OnboardingQuizFinal";
import NavigationHeader from "../NavigationHeader";
import NavigationOverlay from "../NavigationOverlay";

import NavigationModalContainer from "../NavigationModalContainer";

const Stack = createStackNavigator();
const LanguageModalStack = createStackNavigator();

function LanguageModalNavigator(props: StackScreenProps<{}>) {
  const options: Partial<StackNavigationOptions> = {
    headerMode: "float",
    header: NavigationHeader,
    headerStyle: { backgroundColor: "transparent" },
  };

  return (
    <NavigationModalContainer {...props}>
      <LanguageModalStack.Navigator>
        <LanguageModalStack.Screen
          name={ScreenName.OnboardingLanguage}
          component={OnboardingLanguage}
          options={{
            title: "onboarding.stepLanguage.title",
            ...options,
          }}
        />
        <LanguageModalStack.Screen
          name={ScreenName.OnboardingStepLanguageGetStarted}
          component={OnboardingStepLanguageGetStarted}
          options={{
            title: "onboarding.stepLanguage.title",
            ...options,
          }}
        />
      </LanguageModalStack.Navigator>
    </NavigationModalContainer>
  );
}

const modalOptions: Partial<StackNavigationOptions> = {
  presentation: "transparentModal",
  cardOverlayEnabled: true,
  cardOverlay: () => <NavigationOverlay />,
  ...TransitionPresets.ModalSlideFromBottomIOS,
};

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenName.OnboardingWelcome}
        component={OnboardingWelcome}
      />
      <Stack.Screen
        // TODO : index the name
        name={"OnboardingModal"}
        component={LanguageModalNavigator}
        options={modalOptions}
      />
      <Stack.Screen
        name={ScreenName.OnboardingTermsOfUse}
        component={OnboardingTerms}
      />
      <Stack.Screen
        name={ScreenName.OnboardingDeviceSelection}
        component={OnboardingDeviceSelection}
      />
      <Stack.Screen
        name={ScreenName.OnboardingUseCase}
        component={OnboardingUseCase}
      />
      <Stack.Screen
        name={ScreenName.OnboardingSetNewDeviceInfo}
        component={OnboardingNewDeviceInfo}
      />

      <Stack.Screen
        name={ScreenName.OnboardingSetNewDevice}
        component={OnboardingNewDevice}
      />

      <Stack.Screen
        name={ScreenName.OnboardingRecoveryPhrase}
        component={OnboardingRecoveryPhrase}
      />

      <Stack.Screen
        name={ScreenName.OnboardingInfoModal}
        component={OnboardingInfoModal}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />

      <Stack.Screen
        name={ScreenName.OnboardingPairNew}
        component={OnboardingPairNew}
      />

      <Stack.Screen
        name={ScreenName.OnboardingImportAccounts}
        component={OnboardingImportAccounts}
      />

      <Stack.Screen
        name={ScreenName.OnboardingFinish}
        component={OnboardingFinish}
      />

      <Stack.Screen
        name={NavigatorName.PasswordAddFlow}
        component={PasswordAddFlowNavigator}
      />

      <Stack.Screen
        name={ScreenName.OnboardingQuiz}
        component={OnboardingQuiz}
      />

      <Stack.Screen
        name={ScreenName.OnboardingQuizFinal}
        component={OnboardingQuizFinal}
      />
    </Stack.Navigator>
  );
}
