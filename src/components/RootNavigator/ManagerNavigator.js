// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, NavigatorName } from "../../const";
import Manager from "../../screens/Manager";
import ManagerMainNavigator from "./ManagerMainNavigator";
import { stackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";

export default function ManagerNavigator() {
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
          title: ({ route }) => route.params?.title ?? "manager.title",
          headerRight: null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={NavigatorName.ManagerMain}
        component={ManagerMainNavigator}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
