// @flow
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { TabName } from "../../const";
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
      <Tab.Screen name={TabName.RatesList} component={RatesList} />
      <Tab.Screen name={TabName.CurrenciesList} component={CurrenciesList} />
    </Tab.Navigator>
  );
}

const Tab = createMaterialTopTabNavigator();
