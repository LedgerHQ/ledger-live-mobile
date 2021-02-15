// @flow
import React, { useContext, useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import AddAccountsSelectCrypto from "../../screens/AddAccounts/01-SelectCrypto";
import AddAccountsSelectDevice from "../../screens/AddAccounts/02-SelectDevice";
import AddAccountsTokenCurrencyDisclaimer from "../../screens/AddAccounts/02-TokenCurrencyDisclaimer";
import AddAccountsAccounts from "../../screens/AddAccounts/03-Accounts";
import AddAccountsSuccess from "../../screens/AddAccounts/04-Success";
import EditAccountName from "../../screens/AccountSettings/EditAccountName";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import StepHeader from "../StepHeader";
import { context as _ptContext } from "../../screens/ProductTour/Provider";

type Route = {
  params: ?{ currency: *, token?: * },
};

const totalSteps = "3";

export default function AddAccountsNavigator({ route }: { route: Route }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const ptContext = useContext(_ptContext);
  const currency = route && route.params && route.params.currency;
  const token = route && route.params && route.params.token;
  const stackNavConfig = useMemo(() => getStackNavigatorConfig(colors), [
    colors,
  ]);
  return (
    <Stack.Navigator
      headerMode="float"
      initialRouteName={
        token
          ? ScreenName.AddAccountsTokenCurrencyDisclaimer
          : currency
          ? ScreenName.AddAccountsSelectDevice
          : ScreenName.AddAccountsSelectCrypto
      }
      screenOptions={{
        ...stackNavConfig,
        headerStyle:
          ptContext.currentStep === "CREATE_ACCOUNT"
            ? { backgroundColor: colors.live }
            : {},
        headerTitleStyle:
          ptContext.currentStep === "CREATE_ACCOUNT"
            ? {
                color: colors.white,
              }
            : {},
        headerTintColor:
          ptContext.currentStep === "CREATE_ACCOUNT" ? colors.white : null,
      }}
    >
      <Stack.Screen
        name={ScreenName.AddAccountsSelectCrypto}
        component={AddAccountsSelectCrypto}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("common.cryptoAsset")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "1",
                totalSteps,
              })}
              style={style}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.AddAccountsSelectDevice}
        component={AddAccountsSelectDevice}
        initialParams={currency ? { currency, inline: true } : undefined}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("common.device")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "2",
                totalSteps,
              })}
              style={style}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.AddAccountsAccounts}
        component={AddAccountsAccounts}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("tabs.accounts")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "3",
                totalSteps,
              })}
              style={style}
            />
          ),
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.AddAccountsSuccess}
        component={AddAccountsSuccess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.EditAccountName}
        component={EditAccountName}
        options={{
          title: t("account.settings.accountName.title"),
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.AddAccountsTokenCurrencyDisclaimer}
        component={AddAccountsTokenCurrencyDisclaimer}
        initialParams={token ? { token } : undefined}
        options={{
          title: t("addAccounts.tokens.title"),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
