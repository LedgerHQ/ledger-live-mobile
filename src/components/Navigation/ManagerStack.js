// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, StackName } from "../../const";
import Manager from "../../screens/Manager";
import ManagerMain from "./ManagerMainTab";

export default function ManagerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenName.Manager} component={Manager} />
      <Stack.Screen name={StackName.ManagerMain} component={ManagerMain} />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
