// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import Accounts from "../../screens/Accounts";
import Account from "../../screens/Account";
import { stackNavigatorConfig } from "../../navigation/navigatorConfig";

export default function AccountsNavigator() {
  return (
    <Stack.Navigator screenOptions={stackNavigatorConfig}>
      <Stack.Screen name={ScreenName.Accounts} component={Accounts} />
      <Stack.Screen name={ScreenName.Account} component={Account} />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
