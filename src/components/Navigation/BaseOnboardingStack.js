// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, StackName } from "../../const";
import PairDevices from "../../screens/PairDevices";
import EditDeviceName from "../../screens/EditDeviceName";
import OnboardingStack from "./OnboardingStack";
import ImportAccountsStack from "./ImportAccountsStack";
import PasswordAddFlowStack from "./PasswordAddFlowStack";
import PasswordModifyFlowStack from "./PasswordModifyFlowStack";

export default function BaseOnboardingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={StackName.Onboarding} component={OnboardingStack} />
      <Stack.Screen
        name={StackName.ImportAccounts}
        component={ImportAccountsStack}
      />
      <Stack.Screen name={ScreenName.PairDevices} component={PairDevices} />
      <Stack.Screen
        name={ScreenName.EditDeviceName}
        component={EditDeviceName}
      />
      <Stack.Screen
        name={StackName.PasswordAddFlow}
        component={PasswordAddFlowStack}
      />
      <Stack.Screen
        name={StackName.PasswordModifyFlow}
        component={PasswordModifyFlowStack}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
