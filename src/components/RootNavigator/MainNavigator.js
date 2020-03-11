// @flow
import React from "react";
import { ScreenName, NavigatorName } from "../../const";
import PortfolioIcon from "../../icons/Portfolio";
import Portfolio from "../../screens/Portfolio";
import Transfer, { TransferHeader } from "../../screens/Transfer";
import AccountsNavigator from "./AccountsNavigator";
import ManagerNavigator from "./ManagerNavigator";
import SettingsNavigator from "./SettingsNavigator";
import styles from "../../navigation/styles";
import TabIcon from "../TabIcon";
import AccountsIcon from "../../icons/Accounts";
import ManagerIcon from "../../icons/Manager";
import NanoXIcon from "../../icons/TabNanoX";
import ReadOnlyTab from "../ReadOnlyTab";
import SettingsIcon from "../../icons/Settings";

import Tab from "./CustomBlockRouterNavigator";

export default function MainNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: styles.bottomTabBar,
        showLabel: false,
      }}
    >
      <Tab.Screen
        name={ScreenName.Portfolio}
        component={Portfolio}
        options={{
          tabBarIcon: (props: *) => (
            <TabIcon Icon={PortfolioIcon} i18nKey="tabs.portfolio" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name={NavigatorName.AccountsStack}
        component={AccountsNavigator}
        options={{
          tabBarIcon: (props: *) => (
            <TabIcon Icon={AccountsIcon} i18nKey="tabs.accounts" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenName.Transfer}
        component={Transfer}
        options={{
          headerShown: false,
          tabBarIcon: (props: *) => <TransferHeader {...props} />,
        }}
      />
      <Tab.Screen
        name={NavigatorName.Manager}
        component={ManagerNavigator}
        options={{
          tabBarIcon: (props: *) => (
            <ReadOnlyTab
              OnIcon={NanoXIcon}
              oni18nKey="tabs.nanoX"
              OffIcon={ManagerIcon}
              offi18nKey="tabs.manager"
              {...props}
            />
          ),
          tabBarVisible: ({ route }) =>
            route.params ? !route.params.editMode : true,
        }}
      />
      <Tab.Screen
        name={NavigatorName.Settings}
        component={SettingsNavigator}
        options={{
          tabBarIcon: (props: *) => (
            <TabIcon Icon={SettingsIcon} i18nKey="tabs.settings" {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
