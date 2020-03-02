// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScreenName } from "../../const";
import styles from "../../navigation/styles";
import ManagerAppsList from "../../screens/Manager/AppsList";
import ManagerDevice from "../../screens/Manager/Device";

export default function ManagerMainNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        title: t("tabs.manager"),
        headerStyle: styles.headerNoShadow,
      }}
    >
      <Tab.Screen
        name={ScreenName.ManagerAppsList}
        component={ManagerAppsList}
        options={{ title: t("manager.appList.title") }}
      />
      <Tab.Screen name={ScreenName.ManagerDevice} component={ManagerDevice} />
    </Tab.Navigator>
  );
}

const Tab = createMaterialTopTabNavigator();
