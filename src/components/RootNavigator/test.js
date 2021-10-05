import React, { useMemo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../../screens/MainScreen";
import { BackButton } from "../../screens/OperationDetails";
import SymbolDashboard from "../../screens/SymbolDashboard";
import SearchIcon from "../../icons/Search";

export default function testSymbolNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="test"
        component={MainScreen}
        options={({ navigation }) => {
          return ({
            headerLeft: () => <BackButton navigation={navigation} />,
            headerRight: () => (
              <View style={styles.iconContainer}>
                <SearchIcon size={20} color={"grey"} />
              </View>),
            headerTitle: ""
          })
        }}
      />
      <Stack.Screen
        name="SymbolDashboard"
        component={SymbolDashboard}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 18,
  }
});
