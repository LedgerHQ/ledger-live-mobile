// @flow
import React, { useContext } from "react";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName, NavigatorName } from "../../const";
import AddAccountsSelectCrypto from "../../screens/AddAccounts/01-SelectCrypto";
import AddAccountsSelectDevice from "../../screens/AddAccounts/02-SelectDevice";
import AddAccountsTokenCurrencyDisclaimer from "../../screens/AddAccounts/02-TokenCurrencyDisclaimer";
import AddAccountsAccounts from "../../screens/AddAccounts/03-Accounts";
import AddAccountsSuccess from "../../screens/AddAccounts/04-Success";
import AddAccountsHeaderRightClose from "../../screens/AddAccounts/AddAccountsHeaderRightClose";
import EditAccountName from "../../screens/AccountSettings/EditAccountName";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import StepHeader from "../StepHeader";
import { context as _ptContext } from "../../screens/ProductTour/Provider";
import { navigate } from "../../rootnavigation";
import colors from "../../colors";

type Route = {
  params: ?{ currency: * },
};

const totalSteps = "3";

export default function AddAccountsNavigator({ route }: { route: Route }) {
  const { t } = useTranslation();
  const ptContext = useContext(_ptContext);
  const currency = route && route.params && route.params.currency;
  const token = route && route.params && route.params.token;
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
        ...closableStackNavigatorConfig,
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
        headerRight: () =>
          ptContext.currentStep === "CREATE_ACCOUNT" ? null : (
            <AddAccountsHeaderRightClose />
          ),
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
          headerLeft:
            ptContext.currentStep === "CREATE_ACCOUNT"
              ? props => (
                  <HeaderBackButton
                    {...props}
                    onPress={() => {
                      navigate(NavigatorName.ProductTour, {
                        screen: ScreenName.ProductTourMenu,
                      });
                    }}
                  />
                )
              : null,
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
