// @flow
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ScreenName, NavigatorName } from "../../const";
import Portfolio from "../../screens/Portfolio";
import Transfer from "../../screens/Transfer";
import AccountsStack from "./AccountsNavigator";
import ManagerStack from "./ManagerNavigator";
import SettingsStack from "./SettingsNavigator";

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={ScreenName.Portfolio} component={Portfolio} />
      <Tab.Screen
        name={NavigatorName.AccountsStack}
        component={AccountsStack}
      />
      <Tab.Screen name={ScreenName.Transfer} component={Transfer} />
      <Tab.Screen name={NavigatorName.ManagerStack} component={ManagerStack} />
      <Tab.Screen
        name={NavigatorName.SettingsStack}
        component={SettingsStack}
      />
    </Tab.Navigator>
  );
}

const Tab = createBottomTabNavigator();
