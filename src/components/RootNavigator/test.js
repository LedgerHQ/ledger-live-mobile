import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../../screens/MainScreen";
import { BackButton } from "../../screens/OperationDetails";
import SymbolDashboard from "../../screens/SymbolDashboard";

export default function testSymbolNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="test"
          component={MainScreen}
          options={({ navigation }) => {
            return ({headerLeft: () => <BackButton navigation={navigation} />})
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
