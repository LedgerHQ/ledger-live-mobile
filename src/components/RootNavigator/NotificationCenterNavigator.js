// @flow
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import styles from "../../navigation/styles";
import NotificationCenterNews from "../../screens/NotificationCenter/News";
import NotificationCenterStatus from "../../screens/NotificationCenter/Status";
import LText from "../LText";

type TabLabelProps = {
  focused: boolean,
  color: string,
};

const Tab = createMaterialTopTabNavigator();

export default function NotificationCenterNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBarOptions={{
        headerStyle: styles.headerNoShadow,
        indicatorStyle: {
          backgroundColor: colors.live,
        },
      }}
    >
      <Tab.Screen
        name={ScreenName.NotificationCenterNews}
        component={NotificationCenterNews}
        options={{
          title: t("notificationCenter.news.title"),
          tabBarLabel: ({ focused, color }: TabLabelProps) => (
            // width has to be a little bigger to accomodate the switch in size between semibold to regular
            <LText style={{ width: "110%", color }} semiBold={focused}>
              {t("notificationCenter.news.title")}
            </LText>
          ),
        }}
      />
      <Tab.Screen
        name={ScreenName.NotificationCenterStatus}
        component={NotificationCenterStatus}
        options={{
          title: t("notificationCenter.status.title"),
          tabBarLabel: ({ focused, color }: TabLabelProps) => (
            //  width has to be a little bigger to accomodate the switch in size between semibold to regular
            <LText style={{ width: "110%", color }} semiBold={focused}>
              {t("notificationCenter.status.title")}
            </LText>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
