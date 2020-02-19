// @flow
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import styles from "../../navigation/styles";
import RatesList from "../../screens/Settings/CryptoAssets/Rates/RatesList";
import CurrenciesList from "../../screens/Settings/CryptoAssets/Currencies/CurrenciesList";

export default function CryptoAssetsSettingsTab() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        title: t("settings.cryptoAssets.header"),
        headerStyle: styles.headerNoShadow,
      }}
    >
      <Tab.Screen
        name={ScreenName.RatesList}
        component={RatesList}
        options={{ headerTitle: t("settings.rates.header") }}
      />
      <Tab.Screen
        name={ScreenName.CurrenciesList}
        component={CurrenciesList}
        options={{ headerTitle: t("settings.currencies.header") }}
      />
    </Tab.Navigator>
  );
}

const Tab = createMaterialTopTabNavigator();
