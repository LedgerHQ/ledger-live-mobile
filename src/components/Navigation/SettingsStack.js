// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import Settings from "../../screens/Settings";
import CountervalueSettings from "../../screens/Settings/General/CountervalueSettings";

export default function SettingsStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenName.Settings}
        component={Settings}
        options={{
          title: t("settings.header"),
        }}
      />
      <Stack.Screen
        name={ScreenName.CountervalueSettings}
        component={CountervalueSettings}
        options={{
          title: t("settings.display.counterValue"),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
