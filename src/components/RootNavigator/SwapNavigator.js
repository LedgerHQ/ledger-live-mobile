// @flow

import React, { useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import SwapError from "../../screens/Swap2/Error";
import SwapKYC from "../../screens/Swap2/KYC";
import SwapKYCStates from "../../screens/Swap2/KYC/StateSelect";
import Swap from "../../screens/Swap2/SwapEntry";
import SwapFormNavigator from "./SwapFormNavigator";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";
import StepHeader from "../StepHeader";

export default function SwapNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );

  return (
    <Stack.Navigator
      screenOptions={{ ...stackNavigationConfig, headerShown: false }}
    >
      <Stack.Screen
        name={ScreenName.Swap}
        component={Swap}
        options={{
          headerStyle: styles.headerNoShadow,
          title: t("transfer.swap.landing.header"),
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapFormOrHistory}
        component={SwapFormNavigator}
        options={{
          headerStyle: styles.headerNoShadow,
          title: t("transfer.swap.form.tab"),
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapKYC}
        component={SwapKYC}
        options={{
          headerTitle: () => <StepHeader title={t("transfer.swap.title")} />,
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapKYCStates}
        component={SwapKYCStates}
        options={{
          headerTitle: () => (
            <StepHeader title={t("transfer.swap.kyc.states")} />
          ),
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapError}
        component={SwapError}
        options={{
          headerTitle: () => <StepHeader title={t("transfer.swap.title")} />,
          headerLeft: null,
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
