// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import SendFundsMain from "../../screens/SendFunds/01-SelectAccount";
import SendSelectRecipient from "../../screens/SendFunds/02-SelectRecipient";
import SendAmount from "../../screens/SendFunds/03-Amount";
import SendSummary from "../../screens/SendFunds/04-Summary";
import SendConnectDevice from "../../screens/SendFunds/05-ConnectDevice";
import SendValidation from "../../screens/SendFunds/06-Validation";
import SendValidationSuccess from "../../screens/SendFunds/07-ValidationSuccess";
import SendValidationError from "../../screens/SendFunds/07-ValidationError";

export default function SendFundsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenName.SendFundsMain} component={SendFundsMain} />
      <Stack.Screen
        name={ScreenName.SendSelectRecipient}
        component={SendSelectRecipient}
      />
      <Stack.Screen name={ScreenName.SendAmount} component={SendAmount} />
      <Stack.Screen name={ScreenName.SendSummary} component={SendSummary} />
      <Stack.Screen
        name={ScreenName.SendConnectDevice}
        component={SendConnectDevice}
      />
      <Stack.Screen
        name={ScreenName.SendValidation}
        component={SendValidation}
      />
      <Stack.Screen
        name={ScreenName.SendValidationSuccess}
        component={SendValidationSuccess}
      />
      <Stack.Screen
        name={ScreenName.SendValidationError}
        component={SendValidationError}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
