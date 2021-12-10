// @flow
import React, { useMemo } from "react";
import { Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import {
  getStackNavigatorConfig,
  defaultNavigationOptions,
} from "../../../navigation/navigatorConfig";
import StepHeader from "../../../components/StepHeader";
import { ScreenName } from "../../../const";
import OptInSelectToken from "./01-SelectToken";
import OptInSelectDevice from "../../../screens/SelectDevice";
import OptInConnectDevice from "../../../screens/ConnectDevice";
import OptInValidation from "./03-Validation";
import OptInValidationError from "./03-ValidationError";
import OptInValidationSuccess from "./03-ValidationSuccess";

function OptInFlow() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );

  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavigationConfig,
        gestureEnabled: Platform.OS === "ios",
      }}
    >
      <Stack.Screen
        name={ScreenName.SolanaOptInSelectToken}
        component={OptInSelectToken}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("solana.optIn.stepperHeader.selectToken")}
              subtitle={t("solana.optIn.stepperHeader.stepRange", {
                currentStep: "1",
                totalSteps: "3",
              })}
            />
          ),
          headerLeft: () => null,
          headerStyle: {
            ...defaultNavigationOptions.headerStyle,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.SolanaOptInSelectDevice}
        component={OptInSelectDevice}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("solana.optIn.stepperHeader.connectDevice")}
              subtitle={t("solana.optIn.stepperHeader.stepRange", {
                currentStep: "2",
                totalSteps: "3",
              })}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.SolanaOptInConnectDevice}
        component={OptInConnectDevice}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("solana.optIn.stepperHeader.connectDevice")}
              subtitle={t("solana.optIn.stepperHeader.stepRange", {
                currentStep: "2",
                totalSteps: "3",
              })}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.SolanaOptInValidation}
        component={OptInValidation}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("solana.optIn.stepperHeader.verification")}
              subtitle={t("solana.optIn.stepperHeader.stepRange", {
                currentStep: "3",
                totalSteps: "3",
              })}
            />
          ),
          headerLeft: null,
          headerRight: null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.SolanaOptInValidationError}
        component={OptInValidationError}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.SolanaOptInValidationSuccess}
        component={OptInValidationSuccess}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

const options = {
  headerShown: false,
};

export { OptInFlow as component, options };

const Stack = createStackNavigator();
