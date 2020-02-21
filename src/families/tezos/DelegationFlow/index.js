// @flow
import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { closableStackNavigatorConfig } from "../../../navigation/navigatorConfig";

import DelegationStarted from "./Started";
import DelegationSummary from "./Summary";
import DelegationSelectValidator from "./SelectValidator";
import DelegationConnectDevice from "./ConnectDevice";
import DelegationValidation from "./Validation";
import DelegationValidationSuccess from "./ValidationSuccess";
import DelegationValidationError from "./ValidationError";

export default function DelegationFlow() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...closableStackNavigatorConfig,
        headerShown: false,
        gesturesEnabled: ({ route }) =>
          Platform.OS === "ios" ? route.params.allowNavigation : false,
      }}
    >
      <Stack.Screen name={"DelegationStarted"} component={DelegationStarted} />
      <Stack.Screen name={"DelegationSummary"} component={DelegationSummary} />
      <Stack.Screen
        name={"DelegationSelectValidator"}
        component={DelegationSelectValidator}
      />
      <Stack.Screen
        name={"DelegationConnectDevice"}
        component={DelegationConnectDevice}
      />
      <Stack.Screen
        name={"DelegationValidation"}
        component={DelegationValidation}
      />
      <Stack.Screen
        name={"DelegationValidationSuccess"}
        component={DelegationValidationSuccess}
      />
      <Stack.Screen
        name={"DelegationValidationError"}
        component={DelegationValidationError}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
