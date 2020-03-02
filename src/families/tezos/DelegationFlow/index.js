// @flow
import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { closableStackNavigatorConfig } from "../../../navigation/navigatorConfig";

import DelegationStarted from "./Started";
import DelegationSummary from "./Summary";
import DelegationSelectValidator from "./SelectValidator";
import DelegationConnectDevice from "./ConnectDevice";
import DelegationValidation from "./Validation";
import DelegationValidationSuccess from "./ValidationSuccess";
import DelegationValidationError from "./ValidationError";
import StepHeader from "../../../components/StepHeader";

function DelegationFlow() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        ...closableStackNavigatorConfig,
        headerShown: false,
        gesturesEnabled: ({ route }) =>
          Platform.OS === "ios" ? route.params.allowNavigation : false,
      }}
    >
      <Stack.Screen
        name={"DelegationStarted"}
        component={DelegationStarted}
        options={{
          headerTitle: <StepHeader title={t("delegation.started.title")} />,
        }}
      />
      <Stack.Screen
        name={"DelegationSummary"}
        component={DelegationSummary}
        options={{
          headerLeft: null,
          gesturesEnabled: false,
          headerTitle: (
            <StepHeader
              title={t("delegation.summaryTitle")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "1",
                totalSteps: "3",
              })}
            />
          ),
        }}
      />
      <Stack.Screen
        name={"DelegationSelectValidator"}
        component={DelegationSelectValidator}
        options={{
          headerRight: null,
          gesturesEnabled: false,
          headerTitle: (
            <StepHeader title={t("delegation.selectValidatorTitle")} />
          ),
        }}
      />
      <Stack.Screen
        name={"DelegationConnectDevice"}
        component={DelegationConnectDevice}
        options={{
          headerTitle: (
            <StepHeader
              title={t("send.stepperHeader.connectDevice")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "2",
                totalSteps: "3",
              })}
            />
          ),
        }}
      />
      <Stack.Screen
        name={"DelegationValidation"}
        component={DelegationValidation}
        options={{
          headerTitle: (
            <StepHeader
              title={t("send.stepperHeader.verification")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "3",
                totalSteps: "3",
              })}
            />
          ),
          headerLeft: null,
          headerRight: null,
          gesturesEnabled: false,
        }}
      />
      <Stack.Screen
        name={"DelegationValidationSuccess"}
        component={DelegationValidationSuccess}
        options={{
          gesturesEnabled: false,
        }}
      />
      <Stack.Screen
        name={"DelegationValidationError"}
        component={DelegationValidationError}
      />
    </Stack.Navigator>
  );
}

export { DelegationFlow as component };

const Stack = createStackNavigator();
