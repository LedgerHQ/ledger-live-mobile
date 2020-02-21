// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import AccountsIcon from "../../icons/Accounts";
import Accounts from "../../screens/Accounts";
import Account from "../../screens/Account";
import { stackNavigatorConfig } from "../../navigation/navigatorConfig";
import TabIcon from "../TabIcon";

export default function AccountsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavigatorConfig,
        headerShown: true,
        tabBarIcon: (props: *) => (
          <TabIcon Icon={AccountsIcon} i18nKey="tabs.accounts" {...props} />
        ),
      }}
    >
      <Stack.Screen name={ScreenName.Accounts} component={Accounts} />
      <Stack.Screen name={ScreenName.Account} component={Account} />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
