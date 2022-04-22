// @flow
import React, { useMemo } from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";
import { ScreenName } from "../../const";

import PaySelectAccount from "../../screens/SelectAccount";
import PaySummary from "../../screens/Pay/02-Summary";
import SelectDevice from "../../screens/SelectDevice";
import SendConnectDevice from "../../screens/ConnectDevice";
import PayValidationSuccess from "../../screens/Pay/04-ValidationSuccess";
import PayValidationError from "../../screens/Pay/04-ValidationError";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import StepHeader from "../StepHeader";

const totalSteps = "4";

export default function PayFundsNavigator() {
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
        name={ScreenName.PaySelectAccount}
        component={PaySelectAccount}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("transfer.pay.headerTitle")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "1",
                totalSteps,
              })}
            />
          ),
        }}
        initialParams={{
          next: ScreenName.PaySummary,
          category: "PayFunds",
        }}
      />
      <Stack.Screen
        name={ScreenName.PaySummary}
        component={PaySummary}
        options={({ route }) => ({
          headerTitle: () => (
            <StepHeader
              title={t(route.params?.title ?? "transfer.pay.titleSummary")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "2",
                totalSteps,
              })}
            />
          ),
        })}
      />
      <Stack.Screen
        name={ScreenName.PaySelectDevice}
        component={SelectDevice}
        options={({ route }) => ({
          headerTitle: () => (
            <StepHeader
              title={t(route.params?.title ?? "transfer.pay.titleDevice")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "3",
                totalSteps,
              })}
            />
          ),
        })}
      />
      <Stack.Screen
        name={ScreenName.PayConnectDevice}
        component={SendConnectDevice}
        options={({ route }) => ({
          headerTitle: () => (
            <StepHeader
              title={t(route.params?.title ?? "transfer.pay.titleDevice")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "3",
                totalSteps,
              })}
            />
          ),
        })}
      />
      <Stack.Screen
        name={ScreenName.PayValidationSuccess}
        component={PayValidationSuccess}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("transfer.pay.titleConfirmation")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "4",
                totalSteps,
              })}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.PayValidationError}
        component={PayValidationError}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("transfer.pay.titleConfirmation")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "4",
                totalSteps,
              })}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
