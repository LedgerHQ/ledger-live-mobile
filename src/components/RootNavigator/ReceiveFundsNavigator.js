// @flow
import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import ReceiveConfirmation from "../../screens/ReceiveFunds/03-Confirmation";
import ReceiveConnectDevice from "../../screens/ReceiveFunds/02-ConnectDevice";
import ReceiveSelectAccount from "../../screens/ReceiveFunds/01-SelectAccount";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";

export default function ReceiveFundsNavigator() {
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        ...closableStackNavigatorConfig,
        headerShown: false,
        gesturesEnabled: ({ route }) =>
          Platform.OS === "ios"
            ? route.params
              ? undefined
              : route.params.allowNavigation
            : false,
      }}
    >
      <Stack.Screen
        name={ScreenName.ReceiveSelectAccount}
        component={ReceiveSelectAccount}
      />
      <Stack.Screen
        name={ScreenName.ReceiveConnectDevice}
        component={ReceiveConnectDevice}
      />
      <Stack.Screen
        name={ScreenName.ReceiveConfirmation}
        component={ReceiveConfirmation}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
