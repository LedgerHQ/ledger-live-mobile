// @flow
import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";
import { ScreenName } from "../../const";
import PlatformExchangeConnect from "../../screens/Platform/exchange/Connect";

export default function PlatformExchangeNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );

  return (
    <Stack.Navigator
      screenOptions={{ ...stackNavigationConfig, headerShown: false }}
    >
      <Stack.Screen
        name={ScreenName.PlatformExchangeConnect}
        component={PlatformExchangeConnect}
        options={{
          headerStyle: styles.headerNoShadow,
          title: t("transfer.swap.landing.header"),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
