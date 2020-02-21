// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName, NavigatorName } from "../../const";
import SettingsIcon from "../../icons/Settings";
import BenchmarkQRStream from "../../screens/BenchmarkQRStream";
import DebugBLE from "../../screens/DebugBLE";
import DebugBLEBenchmark from "../../screens/DebugBLEBenchmark";
import DebugCrash from "../../screens/DebugCrash";
import DebugHttpTransport from "../../screens/DebugHttpTransport";
import DebugIcons from "../../screens/DebugIcons";
import DebugLottie from "../../screens/DebugLottie.js";
import DebugStore from "../../screens/DebugStore";
import DebugSVG from "../../screens/DebugSVG";
import DebugWSImport from "../../screens/DebugWSImport";
import Settings from "../../screens/Settings";
import AboutSettings from "../../screens/Settings/About";
import GeneralSettings from "../../screens/Settings/General";
import CountervalueSettings from "../../screens/Settings/General/CountervalueSettings";
import HelpSettings from "../../screens/Settings/Help";
import CryptoAssetsSettingsTab from "./CryptoAssetsSettingsNavigator";
import CurrencySettings from "../../screens/Settings/CryptoAssets/Currencies/CurrencySettings";
import DebugSettings, {
  DebugDevices,
  DebugMocks,
} from "../../screens/Settings/Debug";
import DebugExport from "../../screens/Settings/Debug/ExportAccounts";
import ExperimentalSettings from "../../screens/Settings/Experimental";
import RateProviderSettings from "../../screens/Settings/CryptoAssets/Rates/RateProviderSettings";
import RepairDevice from "../../screens/RepairDevice";
import { stackNavigatorConfig } from "../../navigation/navigatorConfig";
import TabIcon from "../TabIcon";

export default function SettingsNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavigatorConfig,
        tabBarIcon: (props: *) => (
          <TabIcon Icon={SettingsIcon} i18nKey="tabs.settings" {...props} />
        ),
      }}
    >
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
        name={NavigatorName.CryptoAssetsSettings}
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
      <Stack.Screen
        name={ScreenName.RepairDevice}
        component={RepairDevice}
        options={{
          headerTitle: t("RepairDevice.title"),
        }}
      />
      <Stack.Screen
        name={ScreenName.ExperimentalSettings}
        component={ExperimentalSettings}
        options={{
          headerTitle: t("settings.experimental.title"),
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugSettings}
        component={DebugSettings}
        options={{
          headerTitle: "Debug",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugDevices}
        component={DebugDevices}
        options={{
          headerTitle: "Debug Devices",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugMocks}
        component={DebugMocks}
        options={{
          headerTitle: "Mock & Test",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugExport}
        component={DebugExport}
        options={{
          headerTitle: "Export Accounts",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugBLE}
        component={DebugBLE}
        options={{
          headerTitle: "Debug BLE",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugBLEBenchmark}
        component={DebugBLEBenchmark}
        options={{
          headerTitle: "Debug BLE Benchmark",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugCrash}
        component={DebugCrash}
        options={{
          headerTitle: "Debug Crash",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugStore}
        component={DebugStore}
        options={{
          headerTitle: "Debug Store",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugHttpTransport}
        component={DebugHttpTransport}
        options={{
          headerTitle: "Debug Http Transport",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugIcons}
        component={DebugIcons}
        options={{
          headerTitle: "Debug Icons",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugLottie}
        component={DebugLottie}
        options={{
          headerTitle: "Debug Lottie",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugSVG}
        component={DebugSVG}
        options={{
          headerTitle: "Debug Svg Icons",
        }}
      />
      <Stack.Screen
        name={ScreenName.DebugWSImport}
        component={DebugWSImport}
        options={{
          headerTitle: "Experimental WS Import",
        }}
      />
      <Stack.Screen
        name={ScreenName.BenchmarkQRStream}
        component={BenchmarkQRStream}
        options={{
          headerTitle: "Benchmark QRStream",
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
