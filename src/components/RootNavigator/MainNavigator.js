// @flow
import React, { useContext } from "react";
import { Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ScreenName, NavigatorName } from "../../const";
import Portfolio, { PortfolioTabIcon } from "../../screens/Portfolio";
import Transfer, { TransferTabIcon } from "../../screens/Transfer";
import AccountsNavigator from "./AccountsNavigator";
import ManagerNavigator, { ManagerTabIcon } from "./ManagerNavigator";
import SettingsNavigator from "./SettingsNavigator";
import TabIcon from "../TabIcon";
import AccountsIcon from "../../icons/Accounts";
import SettingsIcon from "../../icons/Settings";
import {
  dismiss as dismissTour,
  context as _ptContext,
} from "../../screens/ProductTour/Provider";

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
  const ptContext = useContext(_ptContext);
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: [
          {
            borderTopColor: colors.lightFog,
            backgroundColor: colors.card,
          },
          hideTabNavigation ? { display: "none" } : {},
        ],
        showLabel: false,
        activeTintColor: colors.live,
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
            <TabIcon
              ptIds={["AccountsTab"]}
              Icon={AccountsIcon}
              i18nKey="tabs.accounts"
              {...props}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenName.Transfer}
        component={Transfer}
        options={{
          headerShown: false,
          tabBarIcon: (props: any) => (
            <TransferTabIcon ptIds={["TransferTab"]} {...props} />
          ),
        }}
      />
      <Tab.Screen
        name={NavigatorName.Manager}
        component={ManagerNavigator}
        options={{
          tabBarIcon: (props: any) => (
            <ManagerTabIcon {...props} ptIds={["ManagerTab"]} />
          ),
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
      <Tab.Screen
        name={NavigatorName.Settings}
        component={SettingsNavigator}
        options={{
          unmountOnBlur: true,
          tabBarIcon: (props: any) => (
            <TabIcon Icon={SettingsIcon} i18nKey="tabs.settings" {...props} />
          ),
          tabBarButton: props => (
            <Pressable
              {...props}
              onLongPress={() => dismissTour(false)}
              delayLongPress={2000}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
