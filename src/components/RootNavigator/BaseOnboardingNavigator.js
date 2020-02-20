// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, NavigatorName } from "../../const";
import PairDevices from "../../screens/PairDevices";
import EditDeviceName from "../../screens/EditDeviceName";
import OnboardingNavigator from "./OnboardingNavigator";
import ImportAccountsNavigator from "./ImportAccountsNavigator";
import PasswordAddFlowNavigator from "./PasswordAddFlowNavigator";
import PasswordModifyFlowNavigator from "./PasswordModifyFlowNavigator";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";

export default function BaseOnboardingNavigator() {
  return (
    <Stack.Navigator
      mode="modal"
      headerMode="screen"
      screenOptions={{
        ...closableStackNavigatorConfig,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={NavigatorName.Onboarding}
        component={OnboardingNavigator}
      />
      <Stack.Screen
        name={NavigatorName.ImportAccounts}
        component={ImportAccountsNavigator}
      />
      <Stack.Screen name={ScreenName.PairDevices} component={PairDevices} />
      <Stack.Screen
        name={ScreenName.EditDeviceName}
        component={EditDeviceName}
      />
      <Stack.Screen
        name={NavigatorName.PasswordAddFlow}
        component={PasswordAddFlowNavigator}
      />
      <Stack.Screen
        name={NavigatorName.PasswordModifyFlow}
        component={PasswordModifyFlowNavigator}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
