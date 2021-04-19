// @flow
import React, { useMemo, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import Accounts from "../../screens/Accounts";
import AccountOrder from "../../screens/Accounts/AccountOrder";
import AddAccount from "../../screens/Accounts/AddAccount";
import Account from "../../screens/Account";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import AccountHeaderRight from "../../screens/Account/AccountHeaderRight";
import AccountHeaderTitle from "../../screens/Account/AccountHeaderTitle";

export default function AccountsNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavConfig = useMemo(() => getStackNavigatorConfig(colors), [
    colors,
  ]);
  const [isAddModalOpened, setIsAddModalOpened] = useState(false);
  return (
    <Stack.Navigator screenOptions={stackNavConfig}>
      <Stack.Screen
        name={ScreenName.Accounts}
        options={{
          title: t("accounts.title"),
          headerLeft: () => <AccountOrder />,
          headerRight: () => (
            <AddAccount
              isAddModalOpened={isAddModalOpened}
              setIsAddModalOpened={setIsAddModalOpened}
            />
          ),
        }}
      >
        {props => <Accounts isAddModalOpened={isAddModalOpened} {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name={ScreenName.Account}
        component={Account}
        options={{
          headerTitle: () => <AccountHeaderTitle />,
          headerRight: () => <AccountHeaderRight />,
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
