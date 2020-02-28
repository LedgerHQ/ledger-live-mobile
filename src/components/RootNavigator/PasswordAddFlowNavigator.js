// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import { i18n } from "../../context/Locale";
import PasswordAdd from "../../screens/Settings/General/PasswordAdd";
import ConfirmPassword from "../../screens/Settings/General/ConfirmPassword";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";

export default function PasswordAddFlowNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ ...closableStackNavigatorConfig, headerShown: false }}
    >
      <Stack.Screen
        name={ScreenName.PasswordAdd}
        component={PasswordAdd}
        options={{ title: i18n.t("auth.addPassword.title") }}
      />
      <Stack.Screen
        name={ScreenName.ConfirmPassword}
        component={ConfirmPassword}
        options={{
          title: i18n.t("auth.confirmPassword.title"),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
