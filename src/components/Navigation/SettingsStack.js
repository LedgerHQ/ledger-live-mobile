// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName, TabName } from "../../const";
import Settings from "../../screens/Settings";
import AboutSettings from "../../screens/Settings/About";
import GeneralSettings from "../../screens/Settings/General";
import CountervalueSettings from "../../screens/Settings/General/CountervalueSettings";
import HelpSettings from "../../screens/Settings/Help";
import CryptoAssetsSettingsTab from "./CryptoAssetsSettingsTab";
import CurrencySettings from "../../screens/Settings/CryptoAssets/Currencies/CurrencySettings";
import RateProviderSettings from "../../screens/Settings/CryptoAssets/Rates/RateProviderSettings";

export default function SettingsStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenName.Settings}
        component={Settings}
        options={{
          headerTitle: t("settings.header"),
        }}
      />
      <Stack.Screen
        name={ScreenName.CountervalueSettings}
        component={CountervalueSettings}
        options={{
          headerTitle: t("settings.display.counterValue"),
        }}
      />
      <Stack.Screen
        name={ScreenName.GeneralSettings}
        component={GeneralSettings}
        options={{
          headerTitle: t("settings.display.title"),
        }}
      />
      <Stack.Screen
        name={ScreenName.AboutSettings}
        component={AboutSettings}
        options={{
          headerTitle: t("settings.about.title"),
        }}
      />
      <Stack.Screen
        name={ScreenName.HelpSettings}
        component={HelpSettings}
        options={{
          headerTitle: t("settings.help.header"),
        }}
      />
      <Stack.Screen
        name={TabName.CryptoAssetsSettings}
        component={CryptoAssetsSettingsTab}
      />
      <Stack.Screen
        name={ScreenName.CurrencySettings}
        component={CurrencySettings}
        options={({ state }) => ({
          headerTitle: state.params.headerTitle,
          headerRight: null,
        })}
      />
      <Stack.Screen
        name={ScreenName.RateProviderSettings}
        component={RateProviderSettings}
        options={{
          headerTitle: t("settings.cryptoAssets.rateProviderHeader"),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
