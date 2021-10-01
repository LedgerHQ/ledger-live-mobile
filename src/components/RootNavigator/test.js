import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../../screens/MainScreen"

export default function testSymbolNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="test"
          component={MainScreen}
        />
        {/* <Stack.Screen
          name={ScreenName.Account}
          component={Account}
          options={{
            headerTitle: () => <AccountHeaderTitle />,
            headerRight: () => <AccountHeaderRight />,
          }}
        /> */}
      </Stack.Navigator>
    );
  }
  
  const Stack = createStackNavigator();
