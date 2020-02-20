// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, StackName, TabName } from "../../const";
import perFamilyScreens from "../../generated/screens";
import OperationDetails from "../../screens/OperationDetails";
import PairDevices from "../../screens/PairDevices";
import EditDeviceName from "../../screens/EditDeviceName";
import Distribution from "../../screens/Distribution";
import Asset from "../../screens/Asset";
import ScanRecipient from "../../screens/SendFunds/ScanRecipient";
import FallbackCameraSend from "../../screens/SendFunds/FallbackCamera/FallbackCameraSend";
import Main from "./MainTab";
import ReceiveFundsStack from "./ReceiveFundsStack";
import SendFundsStack from "./SendFundsStack";
import AddAccountsStack from "./AddAccountsStack";
import FirmwareUpdateStack from "./FirmwareUpdateStack";
import AccountSettingsStack from "./AccountSettingsStack";
import ImportAccountsStack from "./ImportAccountsStack";
import PasswordAddFlowStack from "./PasswordAddFlowStack";
import PasswordModifyFlowStack from "./PasswordModifyFlowStack";
import MigrateAccountsFlowStack from "./MigrateAccountsFlowStack";

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

export default function BaseNavigatorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={TabName.Main} component={Main} />
      <Stack.Screen
        name={StackName.ReceiveFunds}
        component={ReceiveFundsStack}
      />
      <Stack.Screen name={StackName.SendFunds} component={SendFundsStack} />
      <Stack.Screen name={StackName.AddAccounts} component={AddAccountsStack} />
      <Stack.Screen
        name={StackName.FirmwareUpdate}
        component={FirmwareUpdateStack}
      />
      <Stack.Screen
        name={ScreenName.OperationDetails}
        component={OperationDetails}
      />
      <Stack.Screen
        name={StackName.AccountSettings}
        component={AccountSettingsStack}
      />
      <Stack.Screen
        name={StackName.ImportAccounts}
        component={ImportAccountsStack}
      />
      <Stack.Screen name={ScreenName.PairDevices} component={PairDevices} />
      <Stack.Screen
        name={ScreenName.EditDeviceName}
        component={EditDeviceName}
      />
      <Stack.Screen
        name={StackName.PasswordAddFlow}
        component={PasswordAddFlowStack}
      />
      <Stack.Screen
        name={StackName.PasswordModifyFlow}
        component={PasswordModifyFlowStack}
      />
      <Stack.Screen
        name={StackName.MigrateAccountsFlow}
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
