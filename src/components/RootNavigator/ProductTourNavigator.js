// @flow
import React, { useMemo } from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import { ScreenName, NavigatorName } from "../../const";
import ProductTourMenu from "../../screens/ProductTour/ProductTourMenu";
import ProductTourStepStart from "../../screens/ProductTour/ProductTourStepStart";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import { navigate } from "../../rootnavigation";

export default function ProductTourNavigator() {
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );

  const headerStyle = {
    backgroundColor: colors.live,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    elevation: 0,
  };

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        ...stackNavigationConfig,
        gestureEnabled: Platform.OS === "ios",
        headerStyle,
        headerTitleStyle: { color: colors.white },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen
        name={ScreenName.ProductTourMenu}
        component={ProductTourMenu}
        options={{
          headerShown: true,
          headerRight: null,
          headerTitle: null,
          headerLeft: props => (
            <HeaderBackButton
              {...props}
              onPress={() => {
                navigate(NavigatorName.Main, {
                  screen: ScreenName.Portfolio,
                });
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.ProductTourStepStart}
        component={ProductTourStepStart}
        options={{
          headerShown: true,
          headerRight: null,
          headerTitle: null,
          headerStyle: {
            ...headerStyle,
            backgroundColor: "#587ED4",
          },
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
