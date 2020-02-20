// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import PasswordRemove from "../../screens/Settings/General/PasswordRemove";

export default function PasswordModifyFlowNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenName.PasswordRemove}
        component={PasswordRemove}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
