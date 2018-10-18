// @flow
import React from "react";
import { StyleSheet, StatusBar, Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
} from "react-navigation";
import colors from "./colors";
import SettingsIcon from "./icons/Settings";
import ManagerIcon from "./icons/Manager";
import AccountsIcon from "./icons/Accounts";
import HeaderTitle from "./components/HeaderTitle";
import HeaderBackImage from "./components/HeaderBackImage";
import defaultNavigationOptions from "./screens/defaultNavigationOptions";
import Portfolio from "./screens/Portfolio";
import Accounts from "./screens/Accounts";
import Account from "./screens/Account";
import Settings from "./screens/Settings";
import CountervalueSettings from "./screens/Settings/General/CountervalueSettings";
import RateProviderSettings from "./screens/Settings/General/RateProviderSettings";
import GeneralSettings from "./screens/Settings/General";
import AboutSettings from "./screens/Settings/About";
import HelpSettings from "./screens/Settings/Help";
import DebugSettings from "./screens/Settings/Debug";
import CurrencySettings from "./screens/Settings/Currencies/CurrencySettings";
import CurrenciesList from "./screens/Settings/Currencies/CurrenciesList";
import Manager from "./screens/Manager";
import ReceiveFundsMain from "./screens/ReceiveFunds";
import ConnectDevice from "./screens/ConnectDevice";
import SendFundsMain from "./screens/SendFunds";
import SendSelectRecipient from "./screens/SelectRecipient";
import ScanRecipient from "./screens/SelectRecipient/Scan";
import SendSelectFunds from "./screens/SelectFunds";
import SendSummary from "./screens/SendSummary";
import SendValidation from "./screens/Validation";
import OperationDetails from "./screens/OperationDetails";
import Transfer from "./screens/Transfer";
import AccountSettingsMain from "./screens/AccountSettings";
import EditAccountUnits from "./screens/AccountSettings/EditAccountUnits";
import EditAccountName from "./screens/AccountSettings/EditAccountName";
import ScanAccounts from "./screens/ImportAccounts/Scan";
import DisplayResult from "./screens/ImportAccounts/DisplayResult";
import EditFees from "./screens/EditFees";
import VerifyAddress from "./screens/VerifyAddress";
import ReceiveConfirmation from "./screens/ReceiveComfirmation";
import FallBackCameraScreen from "./screens/ImportAccounts/FallBackCameraScreen";
import DebugBLE from "./screens/DebugBLE";
import DebugCrash from "./screens/DebugCrash";
import BenchmarkQRStream from "./screens/BenchmarkQRStream";
import EditDeviceName from "./screens/EditDeviceName";
import PairDevices from "./screens/PairDevices";

// TODO look into all FlowFixMe

const statusBarPadding =
  Platform.OS === "android" ? StatusBar.currentHeight : 0;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightGrey,
  },
  header: {
    height: 48 + statusBarPadding,
    paddingTop: statusBarPadding,
    backgroundColor: colors.white,
    borderBottomWidth: 0,
    elevation: 0,
  },
  bottomTabBar: {
    height: 48,
    borderTopColor: colors.lightFog,
    backgroundColor: colors.white,
  },
  transparentHeader: {
    backgroundColor: "transparent",
  },
  labelStyle: { fontSize: 12 },
});

const StackNavigatorConfig = {
  navigationOptions: {
    headerStyle: styles.header,
    headerTitle: HeaderTitle,
    headerBackTitle: null,
    headerBackImage: HeaderBackImage,
  },
  cardStyle: styles.card,
  headerLayoutPreset: "center",
};

const TransparentHeaderNavigationOptions = {
  headerTransparent: true,
  headerStyle: [styles.header, styles.transparentHeader],
  headerTitle: (props: *) => (
    <HeaderTitle {...props} style={{ color: colors.white }} />
  ),
};

const SettingsStack = createStackNavigator(
  {
    Settings,
    CountervalueSettings,
    RateProviderSettings,
    // $FlowFixMe
    GeneralSettings,
    // $FlowFixMe
    AboutSettings,
    // $FlowFixMe
    HelpSettings,
    CurrenciesList,
    CurrencySettings,
    // $FlowFixMe
    DebugSettings,
    // $FlowFixMe
    DebugBLE,
    // $FlowFixMe
    DebugCrash,
    // $FlowFixMe
    BenchmarkQRStream,
  },
  StackNavigatorConfig,
);

SettingsStack.navigationOptions = {
  ...defaultNavigationOptions,
  tabBarIcon: ({ tintColor }: *) => (
    <SettingsIcon size={18} color={tintColor} />
  ),
};

const ManagerStack = createStackNavigator(
  {
    // $FlowFixMe
    Manager,
  },
  StackNavigatorConfig,
);

ManagerStack.navigationOptions = {
  ...defaultNavigationOptions,
  tabBarIcon: ({ tintColor }: *) => <ManagerIcon size={18} color={tintColor} />,
};

const AccountsStack = createStackNavigator(
  {
    Accounts,
    Account,
  },
  StackNavigatorConfig,
);
AccountsStack.navigationOptions = {
  ...defaultNavigationOptions,
  header: null,
  tabBarIcon: ({ tintColor }: *) => (
    <AccountsIcon size={18} color={tintColor} />
  ),
};

const getTabItems = () => {
  const items: any = {
    Portfolio,
    Accounts: AccountsStack,
    Transfer,
    Manager: ManagerStack,
    Settings: SettingsStack,
  };
  return items;
};

const Main = createBottomTabNavigator(getTabItems(), {
  tabBarOptions: {
    style: styles.bottomTabBar,
  },
});

Main.navigationOptions = {
  header: null,
};

const ReceiveFunds = createStackNavigator(
  {
    ReceiveFundsMain,
    ConnectDevice,
    VerifyAddress,
    ReceiveConfirmation,
  },
  StackNavigatorConfig,
);
ReceiveFunds.navigationOptions = {
  header: null,
};

const SendFunds = createStackNavigator(
  {
    SendFundsMain,
    SendSelectRecipient,
    ScanRecipient: {
      screen: ScanRecipient,
      navigationOptions: TransparentHeaderNavigationOptions,
    },
    SendSelectFunds,
    SendSummary,
    SendValidation,
  },
  StackNavigatorConfig,
);

SendFunds.navigationOptions = {
  header: null,
};

const SendFundsSettings = createStackNavigator(
  {
    EditFees,
  },
  StackNavigatorConfig,
);

SendFundsSettings.navigationOptions = {
  header: null,
};

const AccountSettings = createStackNavigator(
  {
    AccountSettingsMain,
    EditAccountUnits,
    EditAccountName,
    AccountCurrencySettings: CurrencySettings,
    AccountRateProviderSettings: RateProviderSettings,
  },
  StackNavigatorConfig,
);

AccountSettings.navigationOptions = {
  header: null,
};

const ImportAccounts = createStackNavigator(
  {
    ScanAccounts: {
      screen: ScanAccounts,
      navigationOptions: TransparentHeaderNavigationOptions,
    },
    DisplayResult,
    FallBackCameraScreen,
  },
  StackNavigatorConfig,
);

ImportAccounts.navigationOptions = {
  header: null,
};

export const RootNavigator = createStackNavigator(
  {
    Main,
    ReceiveFunds,
    SendFunds,
    OperationDetails,
    AccountSettings,
    ImportAccounts,
    SendFundsSettings,
    PairDevices,
    // $FlowFixMe non-sense error
    EditDeviceName,
  },
  {
    mode: "modal",
    ...StackNavigatorConfig,
  },
);
