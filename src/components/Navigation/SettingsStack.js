// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import Settings from "../../screens/Settings";

export default function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenName.Settings} component={Settings} />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
