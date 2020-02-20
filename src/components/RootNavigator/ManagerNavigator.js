// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, NavigatorName } from "../../const";
import Manager from "../../screens/Manager";
import ManagerMainNavigator from "./ManagerMainNavigator";

export default function ManagerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenName.Manager} component={Manager} />
      <Stack.Screen
        name={NavigatorName.ManagerMain}
        component={ManagerMainNavigator}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
