import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
  StackNavigationOptions,
  StackScreenProps,
} from "@react-navigation/stack";
import { useRoute } from "@react-navigation/native";
import { Flex } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components";
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
import OnboardingPreQuizModal from "../../screens/Onboarding/steps/setupDevice/drawers/OnboardingPreQuizModal";
import OnboardingQuiz from "../../screens/Onboarding/OnboardingQuiz";
import OnboardingQuizFinal from "../../screens/Onboarding/OnboardingQuizFinal";
import NavigationHeader from "../NavigationHeader";
import NavigationOverlay from "../NavigationOverlay";
import NavigationModalContainer from "../NavigationModalContainer";
import OnboardingSetupDeviceInformation from "../../screens/Onboarding/steps/setupDevice/drawers/SecurePinCode";
import OnboardingSetupDeviceRecoveryPhrase from "../../screens/Onboarding/steps/setupDevice/drawers/SecureRecoveryPhrase";
import OnboardingGeneralInformation from "../../screens/Onboarding/steps/setupDevice/drawers/GeneralInformation";
import OnboardingBluetoothInformation from "../../screens/Onboarding/steps/setupDevice/drawers/BluetoothConnection";
import OnboardingWarning from "../../screens/Onboarding/steps/setupDevice/drawers/Warning";
import OnboardingSyncDesktopInformation from "../../screens/Onboarding/steps/setupDevice/drawers/SyncDesktopInformation";
import OnboardingRecoveryPhraseWarning from "../../screens/Onboarding/steps/setupDevice/drawers/RecoveryPhraseWarning";

const Stack = createStackNavigator();
const LanguageModalStack = createStackNavigator();
const SetupNewDeviceModalStack = createStackNavigator();
const SetupDeviceStepStack = createStackNavigator();
const GeneralInformationStack = createStackNavigator();
const OnboardingCarefulWarningStack = createStackNavigator();
const OnboardingPreQuizModalStack = createStackNavigator();

function LanguageModalNavigator(props: StackScreenProps<{}>) {
  const options: Partial<StackNavigationOptions> = {
    header: props => <NavigationHeader {...props} hideBack />,
    headerStyle: { backgroundColor: "transparent" },
  };

  return (
    <NavigationModalContainer {...props} backgroundColor="background.main">
      <LanguageModalStack.Navigator>
        <LanguageModalStack.Screen
          name={ScreenName.OnboardingLanguage}
          component={OnboardingLanguage}
          options={{
            title: "v3.onboarding.stepLanguage.title",
            ...options,
          }}
        />
        <LanguageModalStack.Screen
          name={ScreenName.OnboardingStepLanguageGetStarted}
          component={OnboardingStepLanguageGetStarted}
          options={{
            title: "v3.onboarding.stepLanguage.title",
            ...options,
          }}
        />
      </LanguageModalStack.Navigator>
    </NavigationModalContainer>
  );
}

function SetupDeviceStepSecureRecoveryNavigator(props: StackScreenProps<{}>) {
  const options: Partial<StackNavigationOptions> = {
    header: props => (
      // TODO: Replace this value with constant.purple as soon as the value is fixed in the theme
      <Flex backgroundColor="background.main">
        <NavigationHeader
          {...props}
          hideBack
          containerProps={{ backgroundColor: "transparent" }}
        />
      </Flex>
    ),
    headerStyle: { backgroundColor: "transparent" },
  };

  return (
    <NavigationModalContainer {...props} backgroundColor="background.main">
      <SetupDeviceStepStack.Navigator>
        <SetupDeviceStepStack.Screen
          name={ScreenName.OnboardingSetupDeviceRecoveryPhrase}
          component={OnboardingSetupDeviceRecoveryPhrase}
          options={{ title: "", ...options }}
        />
      </SetupDeviceStepStack.Navigator>
    </NavigationModalContainer>
  );
}

function OnboardingGeneralInformationNavigator(props: StackScreenProps<{}>) {
  const options: Partial<StackNavigationOptions> = {
    header: props => (
      // TODO: Replace this value with constant.purple as soon as the value is fixed in the theme
      <Flex backgroundColor="background.main">
        <NavigationHeader
          {...props}
          hideBack
          containerProps={{ backgroundColor: "transparent" }}
        />
      </Flex>
    ),
    headerStyle: { backgroundColor: "transparent" },
  };

  return (
    <NavigationModalContainer {...props} backgroundColor="background.main">
      <GeneralInformationStack.Navigator>
        <GeneralInformationStack.Screen
          name={ScreenName.OnboardingGeneralInformation}
          component={OnboardingGeneralInformation}
          options={{ title: "", ...options }}
        />
        <GeneralInformationStack.Screen
          name={ScreenName.OnboardingBluetoothInformation}
          component={OnboardingBluetoothInformation}
          options={{ title: "", ...options }}
        />
      </GeneralInformationStack.Navigator>
    </NavigationModalContainer>
  );
}

function SetupDeviceStepNavigator(props: StackScreenProps<{}>) {
  const options: Partial<StackNavigationOptions> = {
    header: props => (
      // TODO: Replace this value with constant.purple as soon as the value is fixed in the theme
      <Flex backgroundColor="background.main">
        <NavigationHeader
          {...props}
          hideBack
          containerProps={{ backgroundColor: "transparent" }}
        />
      </Flex>
    ),
    headerStyle: { backgroundColor: "transparent" },
  };

  return (
    <NavigationModalContainer {...props} backgroundColor="background.main">
      <SetupDeviceStepStack.Navigator>
        <SetupDeviceStepStack.Screen
          name={ScreenName.OnboardingSetupDeviceInformation}
          component={OnboardingSetupDeviceInformation}
          options={{
            title: "v3.onboarding.stepSetupDevice.pinCodeSetup.infoModal.title",
            ...options,
          }}
        />
      </SetupDeviceStepStack.Navigator>
    </NavigationModalContainer>
  );
}

function SetupNewDeviceModalNavigator(props: StackScreenProps<{}>) {
  const route = useRoute();
  const options: Partial<StackNavigationOptions> = {
    header: props => (
      <Flex bg="primary.c60">
        <NavigationHeader
          {...props}
          hideBack
          containerProps={{ backgroundColor: "transparent" }}
        />
      </Flex>
    ),
    headerStyle: { backgroundColor: "transparent" },
  };

  return (
    // TODO: Replace this value with constant.purple as soon as the value is fixed in the theme
    <NavigationModalContainer {...props} backgroundColor="primary.c60">
      <SetupNewDeviceModalStack.Navigator>
        <SetupNewDeviceModalStack.Screen
          name={ScreenName.OnboardingSetNewDeviceInfo}
          component={OnboardingNewDeviceInfo}
          initialParams={route.params}
          options={{
            title: "v3.onboarding.stepNewDevice.title",
            ...options,
          }}
        />
      </SetupNewDeviceModalStack.Navigator>
    </NavigationModalContainer>
  );
}

function OnboardingCarefulWarning(props: StackScreenProps<{}>) {
  const options: Partial<StackNavigationOptions> = {
    header: props => (
      // TODO: Replace this value with constant.purple as soon as the value is fixed in the theme
      <Flex backgroundColor="background.main">
        <NavigationHeader
          {...props}
          hideBack
          containerProps={{ backgroundColor: "transparent" }}
        />
      </Flex>
    ),
    headerStyle: { backgroundColor: "transparent" },
  };

  return (
    <NavigationModalContainer
      {...props}
      deadZoneProps={{ flexGrow: 1 }}
      backgroundColor="background.main"
    >
      <OnboardingCarefulWarningStack.Navigator>
        <OnboardingCarefulWarningStack.Screen
          name={ScreenName.OnboardingModalWarning}
          component={OnboardingWarning}
          options={{ title: "", ...options }}
          initialParams={props.route.params}
        />
        <OnboardingCarefulWarningStack.Screen
          name={ScreenName.OnboardingModalSyncDesktopInformation}
          component={OnboardingSyncDesktopInformation}
          options={{ title: "", ...options }}
          initialParams={props.route.params}
        />
        <OnboardingCarefulWarningStack.Screen
          name={ScreenName.OnboardingModalRecoveryPhraseWarning}
          component={OnboardingRecoveryPhraseWarning}
          options={{ title: "", ...options }}
          initialParams={props.route.params}
        />
      </OnboardingCarefulWarningStack.Navigator>
    </NavigationModalContainer>
  );
}
function OnboardingPreQuizModalNavigator(props: StackScreenProps<{}>) {
  const options: Partial<StackNavigationOptions> = {
    header: props => (
      // TODO: Replace this value with constant.purple as soon as the value is fixed in the theme
      <Flex backgroundColor="primary.c60">
        <NavigationHeader
          {...props}
          hideBack
          containerProps={{ backgroundColor: "transparent" }}
        />
      </Flex>
    ),
    headerStyle: {},
    headerShadowVisible: false,
  };

  return (
    <NavigationModalContainer
      {...props}
      backgroundColor="primary.c60"
      deadZoneProps={{ flexGrow: 1 }}
      contentContainerProps={{ flexGrow: 1 }}
    >
      <OnboardingPreQuizModalStack.Navigator>
        <OnboardingPreQuizModalStack.Screen
          name={ScreenName.OnboardingPreQuizModal}
          component={OnboardingPreQuizModal}
          options={{ title: "", ...options }}
          initialParams={props.route.params}
        />
      </OnboardingPreQuizModalStack.Navigator>
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
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitle: "",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={ScreenName.OnboardingWelcome}
        component={OnboardingWelcome}
      />
      <Stack.Screen
        name={ScreenName.OnboardingModal}
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
        name={ScreenName.OnboardingModalWarning}
        component={OnboardingCarefulWarning}
        options={modalOptions}
      />
      <Stack.Screen
        name={ScreenName.OnboardingPreQuizModal}
        component={OnboardingPreQuizModalNavigator}
        options={modalOptions}
      />
      <Stack.Screen
        name={ScreenName.OnboardingModalSetupNewDevice}
        component={SetupNewDeviceModalNavigator}
        options={modalOptions}
      />
      <Stack.Screen
        name={ScreenName.OnboardingModalSetupSteps}
        component={SetupDeviceStepNavigator}
        options={modalOptions}
      />
      <Stack.Screen
        name={ScreenName.OnboardingModalSetupSecureRecovery}
        component={SetupDeviceStepSecureRecoveryNavigator}
        options={modalOptions}
      />
      <Stack.Screen
        name={ScreenName.OnboardingModalGeneralInformation}
        component={OnboardingGeneralInformationNavigator}
        options={modalOptions}
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
        options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
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
