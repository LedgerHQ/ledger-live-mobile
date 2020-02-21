// @flow
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ScreenName, NavigatorName } from "../../const";
import PortfolioIcon from "../../icons/Portfolio";
import Portfolio from "../../screens/Portfolio";
import Transfer from "../../screens/Transfer";
import AccountsNavigator from "./AccountsNavigator";
import ManagerNavigator from "./ManagerNavigator";
import SettingsNavigator from "./SettingsNavigator";
import styles from "../../navigation/styles";
import HiddenTabBarIfKeyboardVisible from "../HiddenTabBarIfKeyboardVisible";
import TabIcon from "../TabIcon";

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarOptions: {
          style: styles.bottomTabBar,
          showLabel: false,
        },
        tabBarComponent: HiddenTabBarIfKeyboardVisible,
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          defaultHandler();
          navigation.emit("refocus");
        },
      }}
    >
      <Tab.Screen
        name={ScreenName.Portfolio}
        component={Portfolio}
        options={{
          headerShown: true,
          tabBarIcon: (props: *) => (
            <TabIcon Icon={PortfolioIcon} i18nKey="tabs.portfolio" {...props} />
          ),
        }}
      />
      <Tab.Screen name={NavigatorName.Accounts} component={AccountsNavigator} />
      <Tab.Screen name={ScreenName.Transfer} component={Transfer} />
      <Tab.Screen name={NavigatorName.Manager} component={ManagerNavigator} />
      <Tab.Screen name={NavigatorName.Settings} component={SettingsNavigator} />
    </Tab.Navigator>
  );
}

const Tab = createBottomTabNavigator();
