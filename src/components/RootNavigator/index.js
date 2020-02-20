// @flow
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Config from "react-native-config";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigatorName } from "../../const";
import { hasCompletedOnboardingSelector } from "../../reducers/settings";
import BaseNavigatorStack from "./BaseNavigator";
import BaseOnboardingStack from "./BaseOnboardingNavigator";
import ImportAccountsStack from "./ImportAccountsNavigator";

interface Props {
  importDataString: string;
}

export default function RootNavigator({ importDataString }: Props) {
  const hasCompletedOnboarding = useSelector(hasCompletedOnboardingSelector);

  const data = useMemo<string | false>(() => {
    if (!__DEV__ || !importDataString) {
      return false;
    }

    return JSON.parse(Buffer.from(importDataString, "base64").toString("utf8"));
  }, [importDataString]);

  const goToOnboarding = !hasCompletedOnboarding && !Config.SKIP_ONBOARDING;

  return (
    <Stack.Navigator>
      {data ? (
        <Stack.Screen
          name={NavigatorName.ImportAccounts}
          component={ImportAccountsStack}
        />
      ) : goToOnboarding ? (
        <Stack.Screen
          name={NavigatorName.BaseNavigator}
          component={BaseNavigatorStack}
        />
      ) : (
        <Stack.Screen
          name={NavigatorName.BaseOnboarding}
          component={BaseOnboardingStack}
        />
      )}
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
