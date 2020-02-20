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
import Main from "./MainTabNavigator";
import ReceiveFundsStack from "./ReceiveFundsNavigator";
import SendFundsStack from "./SendFundsNavigator";
import AddAccountsStack from "./AddAccountsNavigator";
import FirmwareUpdateStack from "./FirmwareUpdateNavigator";
import AccountSettingsStack from "./AccountSettings";
import ImportAccountsStack from "./ImportAccountsNavigator";
import PasswordAddFlowStack from "./PasswordAddFlowNavigator";
import PasswordModifyFlowStack from "./PasswordModifyFlowNavigator";
import MigrateAccountsFlowStack from "./MigrateAccountsFlowNavigator";

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
    <Stack.Navigator>
      <Stack.Screen name={NavigatorName.Main} component={Main} />
      <Stack.Screen
        name={NavigatorName.ReceiveFunds}
        component={ReceiveFundsStack}
      />
      <Stack.Screen name={NavigatorName.SendFunds} component={SendFundsStack} />
      <Stack.Screen
        name={NavigatorName.AddAccounts}
        component={AddAccountsStack}
      />
      <Stack.Screen
        name={NavigatorName.FirmwareUpdate}
        component={FirmwareUpdateStack}
      />
      <Stack.Screen
        name={ScreenName.OperationDetails}
        component={OperationDetails}
      />
      <Stack.Screen
        name={NavigatorName.AccountSettings}
        component={AccountSettingsStack}
      />
      <Stack.Screen
        name={NavigatorName.ImportAccounts}
        component={ImportAccountsStack}
      />
      <Stack.Screen name={ScreenName.PairDevices} component={PairDevices} />
      <Stack.Screen
        name={ScreenName.EditDeviceName}
        component={EditDeviceName}
      />
      <Stack.Screen
        name={NavigatorName.PasswordAddFlow}
        component={PasswordAddFlowStack}
      />
      <Stack.Screen
        name={NavigatorName.PasswordModifyFlow}
        component={PasswordModifyFlowStack}
      />
      <Stack.Screen
        name={NavigatorName.MigrateAccountsFlow}
        component={MigrateAccountsFlowStack}
      />
      <Stack.Screen name={ScreenName.Distribution} component={Distribution} />
      <Stack.Screen name={ScreenName.Asset} component={Asset} />
      <Stack.Screen name={ScreenName.ScanRecipient} component={ScanRecipient} />
      <Stack.Screen
        name={ScreenName.FallbackCameraSend}
        component={FallbackCameraSend}
      />

      {Object.keys(generatedSendScreens).map(name => (
        <Stack.Screen name={name} component={generatedSendScreens[name]} />
      ))}

      {Object.keys(generatedBaseScreens).map(name => (
        <Stack.Screen name={name} component={generatedSendScreens[name]} />
      ))}
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
