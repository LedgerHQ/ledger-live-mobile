// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import PasswordAdd from "../../screens/Settings/General/PasswordAdd";
import ConfirmPassword from "../../screens/Settings/General/ConfirmPassword";

export default function ImportAccountsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenName.PasswordAdd} component={PasswordAdd} />
      <Stack.Screen
        name={ScreenName.ConfirmPassword}
        component={ConfirmPassword}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
