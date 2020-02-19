// @flow
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ScreenName, StackName } from "../../const";
import Portfolio from "../../screens/Portfolio";
import Transfer from "../../screens/Transfer";
import AccountsStack from "./AccountsStack";
import ManagerStack from "./ManagerStack";
import SettingsStack from "./SettingsStack";

export default function MainTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={ScreenName.Portfolio} component={Portfolio} />
      <Tab.Screen name={StackName.AccountsStack} component={AccountsStack} />
      <Tab.Screen name={ScreenName.Transfer} component={Transfer} />
      <Tab.Screen name={StackName.ManagerStack} component={ManagerStack} />
      <Tab.Screen name={StackName.SettingsStack} component={SettingsStack} />
    </Tab.Navigator>
  );
}

const Tab = createBottomTabNavigator();
