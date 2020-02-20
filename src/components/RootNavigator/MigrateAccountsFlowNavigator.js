// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import MigrateAccountsOverview from "../../screens/MigrateAccounts/01-Overview";
import MigrateAccountsConnectDevice from "../../screens/MigrateAccounts/02-ConnectDevice";
import MigrateAccountsProgress from "../../screens/MigrateAccounts/03-Progress";

export default function MigrateAccountsFlowNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenName.MigrateAccountsOverview}
        component={MigrateAccountsOverview}
      />
      <Stack.Screen
        name={ScreenName.MigrateAccountsConnectDevice}
        component={MigrateAccountsConnectDevice}
      />
      <Stack.Screen
        name={ScreenName.MigrateAccountsProgress}
        component={MigrateAccountsProgress}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
