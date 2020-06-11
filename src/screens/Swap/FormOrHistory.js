// @flow
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import Swap from "./Swap";
import History from "./History";
import styles from "../../navigation/styles";

export default () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      tabBarOptions={{
        headerStyle: styles.headerNoShadow,
      }}
    >
      <Tab.Screen
        name={ScreenName.SwapForm}
        component={Swap}
        options={{ title: t("transfer.swap.form.tab") }}
      />
      <Tab.Screen
        name={ScreenName.SwapHistory}
        component={History}
        options={{ title: t("transfer.swap.history.tab") }}
      />
    </Tab.Navigator>
  );
};

const Tab = createMaterialTopTabNavigator();
