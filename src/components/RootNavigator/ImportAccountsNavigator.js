// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import ScanAccounts from "../../screens/ImportAccounts/Scan";
import DisplayResult from "../../screens/ImportAccounts/DisplayResult";
import FallBackCameraScreen from "../../screens/ImportAccounts/FallBackCameraScreen";

export default function ImportAccountsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenName.ScanAccounts} component={ScanAccounts} />
      <Stack.Screen name={ScreenName.DisplayResult} component={DisplayResult} />
      <Stack.Screen
        name={ScreenName.FallBackCameraScreen}
        component={FallBackCameraScreen}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
