// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, NavigatorName } from "../../const";
import perFamilyScreens from "../../generated/screens";
import OperationDetails from "../../screens/OperationDetails";
import PairDevices from "../../screens/PairDevices";
import EditDeviceName from "../../screens/EditDeviceName";
import Distribution from "../../screens/Distribution";
import Asset from "../../screens/Asset";
import ScanRecipient from "../../screens/SendFunds/ScanRecipient";
import FallbackCameraSend from "../../screens/SendFunds/FallbackCamera/FallbackCameraSend";
import Main from "./MainNavigator";
import ReceiveFundsNavigator from "./ReceiveFundsNavigator";
import SendFundsNavigator from "./SendFundsNavigator";
import AddAccountsNavigator from "./AddAccountsNavigator";
import FirmwareUpdateNavigator from "./FirmwareUpdateNavigator";
import AccountSettingsNavigator from "./AccountSettingsNavigator";
import ImportAccountsNavigator from "./ImportAccountsNavigator";
import PasswordAddFlowNavigator from "./PasswordAddFlowNavigator";
import PasswordModifyFlowNavigator from "./PasswordModifyFlowNavigator";
import MigrateAccountsFlowNavigator from "./MigrateAccountsFlowNavigator";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import TransparentHeaderNavigationOptions from "../../navigation/TransparentHeaderNavigationOptions";

const {
  sendScreens: generatedSendScreens,
  baseScreens: generatedBaseScreens,
}: {
  [key: string]: string,
} = Object.values(perFamilyScreens).reduce(
  (prev, item) => ({
    ...prev,
    sendScreens: {
      ...prev.sendScreens,
      ...item.sendScreens,
    },
    baseScreens: {
      ...prev.baseScreens,
      ...item.baseScreens,
    },
  }),
  { sendScreens: {}, baseScreens: {} },
);

export default function BaseNavigator() {
  return (
    <Stack.Navigator mode="modal" screenOptions={closableStackNavigatorConfig}>
      <Stack.Screen name={NavigatorName.Main} component={Main} />
      <Stack.Screen
        name={NavigatorName.ReceiveFunds}
        component={ReceiveFundsNavigator}
      />
      <Stack.Screen
        name={NavigatorName.SendFunds}
        component={SendFundsNavigator}
      />
      <Stack.Screen
        name={NavigatorName.AddAccounts}
        component={AddAccountsNavigator}
      />
      <Stack.Screen
        name={NavigatorName.FirmwareUpdate}
        component={FirmwareUpdateNavigator}
      />
      <Stack.Screen
        name={ScreenName.OperationDetails}
        component={OperationDetails}
      />
      <Stack.Screen
        name={NavigatorName.AccountSettings}
        component={AccountSettingsNavigator}
      />
      <Stack.Screen
        name={NavigatorName.ImportAccounts}
        component={ImportAccountsNavigator}
      />
      <Stack.Screen name={ScreenName.PairDevices} component={PairDevices} />
      <Stack.Screen
        name={ScreenName.EditDeviceName}
        component={EditDeviceName}
      />
      <Stack.Screen
        name={NavigatorName.PasswordAddFlow}
        component={PasswordAddFlowNavigator}
      />
      <Stack.Screen
        name={NavigatorName.PasswordModifyFlow}
        component={PasswordModifyFlowNavigator}
      />
      <Stack.Screen
        name={NavigatorName.MigrateAccountsFlow}
        component={MigrateAccountsFlowNavigator}
      />
      <Stack.Screen name={ScreenName.Distribution} component={Distribution} />
      <Stack.Screen name={ScreenName.Asset} component={Asset} />
      <Stack.Screen
        name={ScreenName.ScanRecipient}
        component={ScanRecipient}
        options={TransparentHeaderNavigationOptions}
      />
      <Stack.Screen
        name={ScreenName.FallbackCameraSend}
        component={FallbackCameraSend}
      />

      {Object.keys(generatedSendScreens).map(name => (
        <Stack.Screen name={name} component={generatedSendScreens[name]} />
      ))}

      {Object.keys(generatedBaseScreens).map(name => (
        <Stack.Screen name={name} component={generatedBaseScreens[name]} />
      ))}
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
