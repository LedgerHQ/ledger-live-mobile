// @flow

import React, { useMemo } from "react";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import PlatformCatalog from "../../screens/Platform";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";

export default function PlatformNavigator() {
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );
  return (
    <Stack.Navigator screenOptions={stackNavigationConfig}>
      <Stack.Screen
        name={ScreenName.PlatformCatalog}
        component={PlatformCatalog}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createNativeStackNavigator();
