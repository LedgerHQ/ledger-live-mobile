// @flow
import React, { useMemo } from "react";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import PasswordAdd from "../../screens/Settings/General/PasswordAdd";
import ConfirmPassword from "../../screens/Settings/General/ConfirmPassword";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";

export default function PasswordAddFlowNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );
  return (
    <Stack.Navigator screenOptions={stackNavigationConfig}>
      <Stack.Screen
        name={ScreenName.PasswordAdd}
        component={PasswordAdd}
        options={{ title: t("auth.addPassword.title") }}
      />
      <Stack.Screen
        name={ScreenName.ConfirmPassword}
        component={ConfirmPassword}
        options={{
          title: t("auth.confirmPassword.title"),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createNativeStackNavigator();
