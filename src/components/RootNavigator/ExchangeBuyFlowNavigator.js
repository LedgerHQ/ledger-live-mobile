// @flow
import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import ExchangeSelectCurrency from "../../screens/Exchange/SelectCurrency";
import ExchangeSelectAccount from "../../screens/Exchange/SelectAccount";
import ExchangeConnectDevice from "../../screens/Exchange/ConnectDevice";
import ExchangeCoinifyWidget from "../../screens/Exchange/CoinifyWidgetScreen";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import { context as _ptContext } from "../../screens/ProductTour/Provider";
import colors from "../../colors";

export default function ExchangeNavigator() {
  const { t } = useTranslation();
  const ptContext = useContext(_ptContext);
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        ...closableStackNavigatorConfig,
        headerStyle:
          ptContext.currentStep === "BUY_COINS"
            ? { backgroundColor: colors.live }
            : {},
        headerTitleStyle:
          ptContext.currentStep === "BUY_COINS"
            ? {
                color: colors.white,
              }
            : {},
        headerTintColor:
          ptContext.currentStep === "BUY_COINS" ? colors.white : null,
        headerRight: null,
      }}
    >
      <Stack.Screen
        name={ScreenName.ExchangeSelectCurrency}
        component={ExchangeSelectCurrency}
        options={{ title: t("exchange.buy.selectCurrency") }}
      />
      <Stack.Screen
        name={ScreenName.ExchangeSelectAccount}
        component={ExchangeSelectAccount}
        options={{ title: t("exchange.buy.selectAccount") }}
      />
      <Stack.Screen
        name={ScreenName.ExchangeConnectDevice}
        component={ExchangeConnectDevice}
        options={{ title: t("exchange.buy.connectDevice") }}
      />
      <Stack.Screen
        name={ScreenName.ExchangeCoinifyWidget}
        component={ExchangeCoinifyWidget}
        options={{
          headerTitle: () => null,
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
