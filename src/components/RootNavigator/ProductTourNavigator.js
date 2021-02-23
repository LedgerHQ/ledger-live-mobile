// @flow
import React, { useMemo } from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import ProductTourMenu from "../../screens/ProductTour/ProductTourMenu";
import ProductTourStepStart from "../../screens/ProductTour/ProductTourStepStart";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";

export default function ProductTourNavigator() {
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        ...stackNavigationConfig,
        gestureEnabled: Platform.OS === "ios",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={ScreenName.ProductTourMenu}
        component={ProductTourMenu}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.ProductTourStepStart}
        component={ProductTourStepStart}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
