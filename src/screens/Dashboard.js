/* @flow */
import React, { Component } from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { TabNavigator, TabBarTop } from "react-navigation";
import ScreenGeneric from "../components/ScreenGeneric";
import colors from "../colors";

const OperationsTab = () => (
  <View>
    {Array(50)
      .fill(null)
      .map((_, i) => (
        <Text key={i} style={{ padding: 8 }}>
          Operations...
        </Text>
      ))}
  </View>
);
OperationsTab.navigationOptions = {
  tabBarLabel: "OPERATIONS"
};

const MarketTab = () => (
  <View>
    {Array(50)
      .fill(null)
      .map((_, i) => (
        <Text key={i} style={{ padding: 8 }}>
          Market...
        </Text>
      ))}
  </View>
);
MarketTab.navigationOptions = {
  tabBarLabel: "MARKET"
};

const DashboardBody = TabNavigator(
  {
    Home: {
      screen: OperationsTab
    },
    Notifications: {
      screen: MarketTab
    }
  },
  {
    tabBarComponent: TabBarTop,
    tabBarPosition: "top",
    animationEnabled: true,
    swipeEnabled: true,
    tabBarOptions: {
      showIcon: false,
      pressColor: colors.blue,
      activeTintColor: colors.blue,
      inactiveTintColor: colors.blue,
      style: {
        backgroundColor: "white"
      },
      tabStyle: {
        backgroundColor: "white"
      },
      indicatorStyle: {
        backgroundColor: colors.blue
      }
    }
  }
);

export default class Dashboard extends Component<*> {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }: *) => (
      <Image
        source={require("../images/dashboard.png")}
        style={{ tintColor, width: 32, height: 32 }}
      />
    )
  };
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Good morning, Khlalil!</Text>
          <Text style={styles.headerTextSubtitle}>
            Here's a summary of your accounts
          </Text>
        </View>
        <Image
          source={require("../images/update.png")}
          style={{ width: 30, height: 30 }}
        />
      </View>
    );
  };
  render() {
    return (
      <ScreenGeneric renderHeader={this.renderHeader}>
        <View style={styles.carouselCountainer}>
          <Text
            style={{
              color: "white",
              fontFamily: "Open Sans",
              fontWeight: "400",
              fontSize: 24
            }}
          >
            Open Sans Regular
          </Text>
          <Text
            style={{
              color: "white",
              fontFamily: "Open Sans",
              fontWeight: "600",
              fontSize: 24
            }}
          >
            Open Sans SemiBold
          </Text>
          <Text
            style={{
              color: "white",
              fontFamily: "Open Sans",
              fontWeight: "700",
              fontSize: 24
            }}
          >
            Open Sans Bold
          </Text>
          <Text
            style={{
              color: "white",
              fontFamily: "Museo Sans",
              fontWeight: "400",
              fontSize: 24
            }}
          >
            Museo Sans Regular
          </Text>
          <Text
            style={{
              color: "white",
              fontFamily: "Museo Sans",
              fontWeight: "600",
              fontSize: 24
            }}
          >
            Museo Sans SemiBold
          </Text>
          <Text
            style={{
              color: "white",
              fontFamily: "Museo Sans",
              fontWeight: "700",
              fontSize: 24
            }}
          >
            Museo Sans Bold
          </Text>
        </View>
        <View style={{ height: 800 }}>
          <DashboardBody />
        </View>
      </ScreenGeneric>
    );
  }
}

const styles = StyleSheet.create({
  carouselCountainer: {
    padding: 40,
    height: 300,
    backgroundColor: colors.blue
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10
  },
  headerLeft: {
    justifyContent: "space-around"
  },
  headerTextSubtitle: {
    color: "white",
    opacity: 0.8,
    fontSize: 12
  },
  headerText: {
    color: "white",
    fontSize: 16
  }
});
