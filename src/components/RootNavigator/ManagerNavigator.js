// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName, NavigatorName } from "../../const";
import Manager from "../../screens/Manager";
import ManagerMain from "../../screens/Manager/Manager";
import OnboardingNavigator from "./OnboardingNavigator";
import { stackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";

export default function ManagerNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavigatorConfig,
        headerStyle: styles.header,
      }}
    >
      <Stack.Screen
        name={ScreenName.Manager}
        component={Manager}
        options={{
          title: t("manager.title"),
          headerRight: null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.ManagerMain}
        component={ManagerMain}
        options={{ title: t("manager.appList.title") }}
      />
      <Stack.Screen
        name={NavigatorName.Onboarding}
        component={OnboardingNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
