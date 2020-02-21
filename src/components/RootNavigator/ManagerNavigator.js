// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, NavigatorName } from "../../const";
import ManagerIcon from "../../icons/Manager";
import NanoXIcon from "../../icons/TabNanoX";
import Manager from "../../screens/Manager";
import ManagerMainNavigator from "./ManagerMainNavigator";
import { stackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";
import ReadOnlyTab from "../ReadOnlyTab";

export default function ManagerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavigatorConfig,
        headerStyle: styles.header,
        tabBarIcon: (props: *) => (
          <ReadOnlyTab
            OnIcon={NanoXIcon}
            oni18nKey="tabs.nanoX"
            OffIcon={ManagerIcon}
            offi18nKey="tabs.manager"
            {...props}
          />
        ),
        tabBarVisible: ({ route }) =>
          route.params ? !route.params.editMode : true,
      }}
    >
      <Stack.Screen name={ScreenName.Manager} component={Manager} />
      <Stack.Screen
        name={NavigatorName.ManagerMain}
        component={ManagerMainNavigator}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
