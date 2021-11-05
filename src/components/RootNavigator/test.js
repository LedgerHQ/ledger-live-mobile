import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../../screens/MainScreen";
import { BackButton } from "../../screens/OperationDetails";
import SymbolDashboard from "../../screens/SymbolDashboard";
import AddFavoritesButton from "../AddFavoritesButton";

export default function testSymbolNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="test"
        component={MainScreen}
        options={() => ({
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
            headerRight: () => (
              <AddFavoritesButton cryptocurrency={currencyOrToken} />
            ),
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
  },
});
