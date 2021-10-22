import React, { useMemo } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../../screens/MainScreen";
import { BackButton } from "../../screens/OperationDetails";
import SymbolDashboard from "../../screens/SymbolDashboard";
import SearchIcon from "../../icons/Search";
// import SymbolHeader from "../SymbolHeader";
// import StarredMark from "../StarredMark";

export default function testSymbolNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="test"
        component={MainScreen}
        options={({ navigation }) => ({
          headerTitle: "Market",
          headerTitleAlign: "center",
        })}
      />
      <Stack.Screen
        name="SymbolDashboard"
        component={SymbolDashboard}
        options={({ navigation, route }) => {
          const { currencyOrToken } = route.params;
          return {
            headerTitle: () => (
              <View style={styles.headerTitle}>
                <Image
                  source={{ uri: currencyOrToken.data.image }}
                  style={styles.headerIcon}
                />
                <Text style={styles.title}>{currencyOrToken.name}</Text>
              </View>
            ),
            headerRight: () => <View />,
            headerLeft: () => <BackButton navigation={navigation} />,
            headerTitleAlign: "center",
          };
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 18,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  }
});
