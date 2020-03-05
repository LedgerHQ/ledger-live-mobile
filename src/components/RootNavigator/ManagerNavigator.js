// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName, NavigatorName } from "../../const";
import Manager from "../../screens/Manager";
import ManagerMainNavigator from "./ManagerMainNavigator";
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
        options={({ route }) => ({
          title: t(route.params?.title ?? "manager.title"),
          headerRight: null,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name={NavigatorName.ManagerMain}
        component={ManagerMainNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
