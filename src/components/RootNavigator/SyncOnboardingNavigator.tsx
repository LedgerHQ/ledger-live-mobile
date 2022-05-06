import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import { SyncOnboarding } from "../../screens/SyncOnboarding";

// TODO - https://reactnavigation.org/docs/typescript/
const Stack = createStackNavigator();

export const SyncOnboardingNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerTitle: "",
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name={ScreenName.SyncOnboardingWelcome}
      component={SyncOnboarding}
    />
  </Stack.Navigator>
);
