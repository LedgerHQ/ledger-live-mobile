// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import ScanAccounts from "../../screens/ImportAccounts/Scan";
import DisplayResult from "../../screens/ImportAccounts/DisplayResult";
import FallBackCameraScreen from "../../screens/ImportAccounts/FallBackCameraScreen";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import TransparentHeaderNavigationOptions from "../../navigation/TransparentHeaderNavigationOptions";

export default function ImportAccountsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ ...closableStackNavigatorConfig, headerShown: false }}
    >
      <Stack.Screen
        name={ScreenName.ScanAccounts}
        component={ScanAccounts}
        options={TransparentHeaderNavigationOptions}
      />
      <Stack.Screen name={ScreenName.DisplayResult} component={DisplayResult} />
      <Stack.Screen
        name={ScreenName.FallBackCameraScreen}
        component={FallBackCameraScreen}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
