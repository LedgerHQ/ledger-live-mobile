// @flow
import React from "react";
import { useTheme } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import LText from "../LText";
import styles from "../../navigation/styles";
import RatesList from "../../screens/Settings/CryptoAssets/Rates/RatesList";
import CurrenciesList from "../../screens/Settings/CryptoAssets/Currencies/CurrenciesList";

type TabLabelProps = {
  focused: boolean,
  color: string,
};

export default function CryptoAssetsSettingsNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBarOptions={{
        headerStyle: {
          ...styles.headerNoShadow,
          backgroundColor: colors.white,
        },
        indicatorStyle: {
          backgroundColor: colors.live,
        },
      }}
    >
      <Tab.Screen
        name={ScreenName.RatesList}
        component={RatesList}
        options={{
          title: t("settings.rates.header"),
          tabBarLabel: ({ focused, color }: TabLabelProps) => (
            /** width has to be a little bigger to accomodate the switch in size between semibold to regular */
            <LText style={{ width: "110%", color }} semiBold={focused}>
              {t("settings.rates.header")}
            </LText>
          ),
        }}
      />
      <Tab.Screen
        name={ScreenName.CurrenciesList}
        component={CurrenciesList}
        options={{
          title: t("settings.currencies.header"),
          tabBarLabel: ({ focused, color }: TabLabelProps) => (
            /** width has to be a little bigger to accomodate the switch in size between semibold to regular */
            <LText style={{ width: "110%", color }} semiBold={focused}>
              {t("settings.currencies.header")}
            </LText>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Tab = createMaterialTopTabNavigator();
