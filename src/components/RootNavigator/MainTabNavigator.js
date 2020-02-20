// @flow
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ScreenName, NavigatorName } from "../../const";
import Portfolio from "../../screens/Portfolio";
import Transfer from "../../screens/Transfer";
import AccountsNavigator from "./AccountsNavigator";
import ManagerNavigator from "./ManagerNavigator";
import SettingsNavigator from "./SettingsNavigator";

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={ScreenName.Portfolio} component={Portfolio} />
      <Tab.Screen name={NavigatorName.Accounts} component={AccountsNavigator} />
      <Tab.Screen name={ScreenName.Transfer} component={Transfer} />
      <Tab.Screen name={NavigatorName.Manager} component={ManagerNavigator} />
      <Tab.Screen name={NavigatorName.Settings} component={SettingsNavigator} />
    </Tab.Navigator>
  );
}

const Tab = createBottomTabNavigator();
