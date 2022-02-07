import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { Text } from "@ledgerhq/native-ui";

import AnalyticsAllocation from "../../screens/Analytics/Allocation";
import AnalyticsOperations from "../../screens/Analytics/Operations";
import { ScreenName } from "../../const";

const Tab = createMaterialTopTabNavigator();

export default function AnalyticsNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Fixme Typescript: Update react-native-tab-view to 3.1.1 to remove Tab.navigator ts error
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.neutral.c100,
          tabBarInactiveTintColor: colors.neutral.c80,
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary.c70,
          },
          tabBarStyle: {
            backgroundColor: colors.background.main,
            borderBottomWidth: 1,
            borderColor: colors.neutral.c40,
          },
        }}
        sceneContainerStyle={{
          backgroundColor: colors.background.main,
        }}
      >
        <Tab.Screen
          name={ScreenName.AnalyticsAllocation}
          component={AnalyticsAllocation}
          options={{
            title: t("v3.analytics.allocation.title"),
            tabBarLabel: (props: any) => (
              <Text variant="body" fontWeight="semiBold" {...props}>
                {t("v3.analytics.allocation.title")}
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name={ScreenName.AnalyticsOperations}
          component={AnalyticsOperations}
          options={{
            title: t("v3.analytics.operations.title"),
            tabBarLabel: (props: any) => (
              <Text variant="body" fontWeight="semiBold" {...props}>
                {t("v3.analytics.operations.title")}
              </Text>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
