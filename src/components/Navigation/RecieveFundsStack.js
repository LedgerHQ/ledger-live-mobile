// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import ReceiveConfirmation from "../../screens/ReceiveFunds/03-Confirmation";
import ReceiveConnectDevice from "../../screens/ReceiveFunds/02-ConnectDevice";
import ReceiveSelectAccount from "../../screens/ReceiveFunds/01-SelectAccount";

export default function ReceiveFundsStack() {
  return (
    <Stack.Navigator>
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
