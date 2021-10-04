import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../../screens/MainScreen";
import { BackButton } from "../../screens/OperationDetails";

export default function testSymbolNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="test"
          component={MainScreen}
          options={({ route, navigation }) => {
            return ({headerLeft: () => <BackButton navigation={navigation} />})
          }}
        />
      </Stack.Navigator>
    );
  }
  
  const Stack = createStackNavigator();
