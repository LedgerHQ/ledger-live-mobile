// @flow
import React from "react";
import { useTheme } from "@react-navigation/native";
import { Icons } from "@ledgerhq/native-ui";
import { ScreenName, NavigatorName } from "../../const";
import Portfolio, { PortfolioTabIcon } from "../../screens/Portfolio";
import Transfer, { TransferTabIcon } from "../../screens/Transfer";
import AccountsNavigator from "./AccountsNavigator";
import PlatformNavigator from "./PlatformNavigator";
import TabIcon from "../TabIcon";
import AccountsIcon from "../../icons/Accounts";
import AppsIcon from "../../icons/Apps";

import Tab from "./CustomBlockRouterNavigator";
import MarketNavigator from "./MarketNavigator";

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
            borderTopColor: colors.lightFog,
            backgroundColor: colors.card,
          },
          hideTabNavigation ? { display: "none" } : {},
        ],
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.live,
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
        listeners={({ route, navigation }) => {
          return {
            tabPress: () => navigation.navigate(route.name)
          }
        }}
        options={{
          unmountOnBlur: true,
          tabBarIcon: (props: any) => (
            <TabIcon Icon={AccountsIcon} i18nKey="tabs.accounts" {...props} />
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
            <TabIcon Icon={AppsIcon} i18nKey="tabs.platform" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name={NavigatorName.Market}
        component={MarketNavigator}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarIcon: (props: any) => (
            <TabIcon
              Icon={Icons.GraphGrowMedium}
              i18nKey="tabs.market"
              {...props}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
