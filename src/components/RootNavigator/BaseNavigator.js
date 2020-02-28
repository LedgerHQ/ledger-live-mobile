// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName, NavigatorName } from "../../const";
import * as families from "../../families";
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

export default function BaseNavigator() {
  return (
    <Stack.Navigator mode="modal" screenOptions={closableStackNavigatorConfig}>
      <Stack.Screen
        name={NavigatorName.Main}
        component={Main}
        options={{ headerShown: false }}
      />
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

      {Object.keys(families).map(name => {
        const { component, options } = families[name];
        return (
          <Stack.Screen
            key={name}
            name={name}
            component={component}
            options={options}
          />
        );
      })}
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
