// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, StackName } from "../../const";
import OnboardingOrNavigator from "../../screens/OnboardingOrNavigator";
import BaseNavigatorStack from "./BaseNavigatorStack";
import BaseOnboardingStack from "./BaseOnboardingStack";

export default function RootNavigatorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenName.OnboardingOrNavigator}
        component={OnboardingOrNavigator}
      />
      <Stack.Screen
        name={StackName.BaseNavigator}
        component={BaseNavigatorStack}
      />
      <Stack.Screen
        name={StackName.BaseOnboarding}
        component={BaseOnboardingStack}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
