// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, NavigatorName } from "../../const";
import PairDevices from "../../screens/PairDevices";
import EditDeviceName from "../../screens/EditDeviceName";
import OnboardingStack from "./OnboardingNavigator";
import ImportAccountsStack from "./ImportAccountsNavigator";
import PasswordAddFlowStack from "./PasswordAddFlowNavigator";
import PasswordModifyFlowStack from "./PasswordModifyFlowNavigator";

export default function BaseOnboardingNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NavigatorName.Onboarding}
        component={OnboardingStack}
      />
      <Stack.Screen
        name={NavigatorName.ImportAccounts}
        component={ImportAccountsStack}
      />
      <Stack.Screen name={ScreenName.PairDevices} component={PairDevices} />
      <Stack.Screen
        name={ScreenName.EditDeviceName}
        component={EditDeviceName}
      />
      <Stack.Screen
        name={NavigatorName.PasswordAddFlow}
        component={PasswordAddFlowStack}
      />
      <Stack.Screen
        name={NavigatorName.PasswordModifyFlow}
        component={PasswordModifyFlowStack}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
