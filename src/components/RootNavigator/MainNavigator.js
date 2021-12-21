// @flow
import React from "react";
import { useTheme } from "styled-components/native";
import { ManagerMedium, WalletMedium } from "@ledgerhq/native-ui/assets/icons";

import { ScreenName, NavigatorName } from "../../const";
import Portfolio, { PortfolioTabIcon } from "../../screens/Portfolio";
import Transfer, { TransferTabIcon } from "../../screens/Transfer";
import AccountsNavigator from "./AccountsNavigator";
import ManagerNavigator, { ManagerTabIcon } from "./ManagerNavigator";
import PlatformNavigator from "./PlatformNavigator";
import TabIcon from "../TabIcon";
import AccountsIcon from "../../icons/Accounts";

import Tab from "./CustomBlockRouterNavigator";

type RouteParams = {
  hideTabNavigation?: boolean,
};
export default function MainNavigator({
  route: { params },
}: {
  route: { params: RouteParams },
}) {
  const { colors } = useTheme();

  const { hideTabNavigation } = params || {};
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: [
          {
            borderTopColor: colors.palette.neutral.c40,
            backgroundColor: colors.palette.background.main,
          },
          hideTabNavigation ? { display: "none" } : {},
        ],
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.palette.primary.c80,
        tabBarInactiveTintColor: colors.palette.neutral.c70,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={ScreenName.Portfolio}
        component={Portfolio}
        options={{
          tabBarIcon: (props: any) => <PortfolioTabIcon {...props} />,
        }}
      />
      <Tab.Screen
        name={NavigatorName.Accounts}
        component={AccountsNavigator}
        options={{
          unmountOnBlur: true,
          tabBarIcon: (props: any) => (
            <TabIcon Icon={WalletMedium} i18nKey="tabs.accounts" {...props} />
          ),
          tabBarTestID: "TabBarAccounts",
        }}
      />
      <Tab.Screen
        name={ScreenName.Transfer}
        component={Transfer}
        options={{
          headerShown: false,
          tabBarIcon: (props: any) => <TransferTabIcon {...props} />,
        }}
      />
      <Tab.Screen
        name={NavigatorName.Platform}
        component={PlatformNavigator}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarIcon: (props: any) => (
            <TabIcon Icon={ManagerMedium} i18nKey="tabs.platform" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name={NavigatorName.Manager}
        component={ManagerNavigator}
        options={{
          tabBarIcon: (props: any) => <ManagerTabIcon {...props} />,
          tabBarTestID: "TabBarManager",
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            // NB The default behaviour is not reset route params, leading to always having the same
            // search query or preselected tab after the first time (ie from Swap/Sell)
            // https://github.com/react-navigation/react-navigation/issues/6674#issuecomment-562813152
            navigation.navigate(NavigatorName.Manager, {
              screen: ScreenName.Manager,
              params: {
                tab: undefined,
                searchQuery: undefined,
                updateModalOpened: undefined,
              },
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}
