// @flow
import React, { useMemo } from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";
import { ScreenName } from "../../const";
import GetPaidAmount from "../../screens/GetPaid/02-SelectAmount";
import GetPaidConfirmation from "../../screens/GetPaid/04-Confirmation";
import GetPaidConnectDevice from "../../screens/GetPaid/03-ConnectDevice";
import GetPaidSelectAccount from "../../screens/SelectAccount";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import StepHeader from "../StepHeader";

const totalSteps = "4";

export default function GetPaidFundsNavigator() {
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
        name={ScreenName.GetPaidSelectAccount}
        component={GetPaidSelectAccount}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("transfer.getPaid.headerTitle")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "1",
                totalSteps,
              })}
            />
          ),
        }}
        initialParams={{
          next: ScreenName.GetPaidSelectAmount,
          category: "GetPaidFunds",
        }}
      />
      <Stack.Screen
        name={ScreenName.GetPaidSelectAmount}
        component={GetPaidAmount}
        options={({ route }) => ({
          headerTitle: () => (
            <StepHeader
              title={t(
                route.params?.title ?? "transfer.getPaid.titleSelectAmount",
              )}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "2",
                totalSteps,
              })}
            />
          ),
        })}
      />
      <Stack.Screen
        name={ScreenName.GetPaidConnectDevice}
        component={GetPaidConnectDevice}
        options={({ route }) => ({
          headerTitle: () => (
            <StepHeader
              title={t(route.params?.title ?? "transfer.getPaid.titleDevice")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "3",
                totalSteps,
              })}
            />
          ),
        })}
      />
      <Stack.Screen
        name={ScreenName.GetPaidConfirmation}
        component={GetPaidConfirmation}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("transfer.getPaid.titleConfirmation")}
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
