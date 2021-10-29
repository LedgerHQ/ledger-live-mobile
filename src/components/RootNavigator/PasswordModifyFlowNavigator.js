// @flow
import React, { useMemo } from "react";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import PasswordRemove from "../../screens/Settings/General/PasswordRemove";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";

export default function PasswordModifyFlowNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );
  return (
    <Stack.Navigator screenOptions={stackNavigationConfig}>
      <Stack.Screen
        name={ScreenName.PasswordRemove}
        component={PasswordRemove}
        options={{
          title: t("auth.confirmPassword.title"),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createNativeStackNavigator();
