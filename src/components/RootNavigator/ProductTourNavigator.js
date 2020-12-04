// @flow
import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import ProductTourMenu from "../../screens/ProductTour/ProductTourMenu";
import ProductTourStepStart from "../../screens/ProductTour/ProductTourStepStart";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";

export default function ProductTourNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        ...closableStackNavigatorConfig,
        gestureEnabled: Platform.OS === "ios",
      }}
    >
      <Stack.Screen
        name={ScreenName.ProductTourMenu}
        component={ProductTourMenu}
        options={{
          headerShown: true,
          headerRight: null,
          headerTitle: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.ProductTourStepStart}
        component={ProductTourStepStart}
        options={{
          headerShown: true,
          headerRight: null,
          headerTitle: null,
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
