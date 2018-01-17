// @flow
import React, { Component } from "react";
import { StyleSheet, View, Image, StatusBar } from "react-native";
import { StackNavigator, TabNavigator, TabBarBottom } from "react-navigation";
import colors from "../colors";
import Dashboard from "../screens/Dashboard";
import Accounts from "../screens/Accounts";
import Search from "../screens/Search";
import Settings from "../screens/Settings";
import EditPersonalInfo from "../screens/EditPersonalInfo";
import Create from "../screens/Create";
import ReceiveFunds from "../screens/ReceiveFunds";
import SendFundsSelectAccount from "../screens/SendFundsSelectAccount";
import SendFundsChoseAmount from "../screens/SendFundsChoseAmount";
import SendFundsScanAddress from "../screens/SendFundsScanAddress";
import SendFundsChoseFee from "../screens/SendFundsChoseFee";
import SendFundsReview from "../screens/SendFundsReview";
import SendFundsPlugDevice from "../screens/SendFundsPlugDevice";
import SendFundsConfirmation from "../screens/SendFundsConfirmation";

const stackNavigatiorDefaultNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.blue,
    borderBottomWidth: 0
  },
  headerTintColor: "white"
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightBackground
  },
  root: {
    flex: 1
  }
});

const SettingsStack = StackNavigator(
  {
    Settings: { screen: Settings },
    EditPersonalInfo: { screen: EditPersonalInfo }
  },
  {
    navigationOptions: stackNavigatiorDefaultNavigationOptions,
    cardStyle: styles.card
  }
);

SettingsStack.navigationOptions = {
  tabBarIcon: ({ tintColor }: *) => (
    <Image
      source={require("../images/settings.png")}
      style={{ tintColor, width: 32, height: 32 }}
    />
  )
};

const MainNavigator = TabNavigator(
  {
    Dashboard: { screen: Dashboard },
    Accounts: { screen: Accounts },
    Create: { screen: Create },
    Search: { screen: Search },
    Settings: { screen: SettingsStack }
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      showLabel: false,
      activeTintColor: "white",
      inactiveTintColor: "rgb(164,165,168)",
      style: {
        backgroundColor: colors.darkBar
      },
      indicatorStyle: {
        backgroundColor: "#ffffff",
        height: 4
      }
    },
    cardStyle: styles.card
  }
);

class Main extends Component<*> {
  static navigationOptions = {
    header: null
  };
  render() {
    return <MainNavigator />;
  }
}

const RootNavigator = StackNavigator(
  {
    Main: { screen: Main },
    ReceiveFunds: { screen: ReceiveFunds },
    // TODO SendFunds. maybe should put in a sub level StackNavigator!!
    SendFundsSelectAccount: { screen: SendFundsSelectAccount },
    SendFundsScanAddress: { screen: SendFundsScanAddress },
    SendFundsChoseAmount: { screen: SendFundsChoseAmount },
    SendFundsChoseFee: { screen: SendFundsChoseFee },
    SendFundsReview: { screen: SendFundsReview },
    SendFundsPlugDevice: { screen: SendFundsPlugDevice },
    SendFundsConfirmation: { screen: SendFundsConfirmation }
  },
  {
    mode: "modal",
    navigationOptions: stackNavigatiorDefaultNavigationOptions,
    cardStyle: styles.card
  }
);

export default class App extends Component<*> {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor={colors.blue} />
        <RootNavigator />
      </View>
    );
  }
}
