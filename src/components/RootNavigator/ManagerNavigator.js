// @flow
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName, NavigatorName } from "../../const";
import Manager from "../../screens/Manager";
import ManagerMain from "../../screens/Manager/Manager";
import OnboardingNavigator from "./OnboardingNavigator";
import { stackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";
import ReadOnlyTab from "../ReadOnlyTab";
import ManagerIcon from "../../icons/Manager";
import NanoXIcon from "../../icons/TabNanoX";
import { lockSubject } from "./CustomBlockRouterNavigator";

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

export function ManagerTabIcon(props: any) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const subscription = lockSubject.subscribe(val => {
      setDisabled(val);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const content = (
    <ReadOnlyTab
      OnIcon={NanoXIcon}
      oni18nKey="tabs.nanoX"
      OffIcon={ManagerIcon}
      offi18nKey="tabs.manager"
      {...props}
    />
  );

  if (!disabled) {
    return content;
  }

  return (
    // Prevent triggering navigation by wrapping tab icon with a dummy touchable
    <TouchableOpacity onPress={() => {}}>{content}</TouchableOpacity>
  );
}
