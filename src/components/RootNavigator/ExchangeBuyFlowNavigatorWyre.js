// @flow
import React, { useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import ExchangeBuyWyre from "../../screens/Exchange/ExchangeBuyWyre";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import AddAccountsHeaderRightClose from "../../screens/AddAccounts/AddAccountsHeaderRightClose";

export default function ExchangeNavigator() {
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );
  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavigationConfig,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={ScreenName.ExchangeSelectCurrency}
        component={ExchangeBuyWyre}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
