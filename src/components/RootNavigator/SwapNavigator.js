// @flow

import React, { useContext } from "react";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName, NavigatorName } from "../../const";
import SwapSummary from "../../screens/Swap/Form/Summary";
import SwapError from "../../screens/Swap/Form/Error";
import SwapFormAmount from "../../screens/Swap/Form/Amount";
import SwapFormOrHistory from "../../screens/Swap/FormOrHistory";
import SwapOperationDetails from "../../screens/Swap/OperationDetails";
import { BackButton } from "../../screens/OperationDetails";
import SwapPendingOperation from "../../screens/Swap/Form/PendingOperation";
import SwapFormSelectCrypto from "../../screens/Swap/Form/SelectAccount/01-SelectCrypto";
import SwapFormSelectAccount from "../../screens/Swap/Form/SelectAccount/02-SelectAccount";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import StepHeader from "../StepHeader";
import { navigate } from "../../rootnavigation";
import colors from "../../colors";
import { context as _ptContext } from "../../screens/ProductTour/Provider";

export default function SwapNavigator() {
  const { t } = useTranslation();
  const ptContext = useContext(_ptContext);
  return (
    <Stack.Navigator
      screenOptions={{
        ...closableStackNavigatorConfig,
        headerStyle:
          ptContext.currentStep === "SWAP_COINS"
            ? { backgroundColor: colors.live }
            : {},
        headerTitleStyle:
          ptContext.currentStep === "SWAP_COINS"
            ? {
                color: colors.white,
              }
            : {},
        headerTintColor:
          ptContext.currentStep === "SWAP_COINS" ? colors.white : null,
        headerRight: null,
      }}
    >
      <Stack.Screen
        name={ScreenName.SwapFormOrHistory}
        component={SwapFormOrHistory}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("transfer.swap.landing.header")}
              style={style}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapFormSelectCrypto}
        component={SwapFormSelectCrypto}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader title={t("transfer.swap.title")} style={style} />
          ),
          headerRight: null,
          headerLeft:
            ptContext.currentStep === "SWAP_COINS"
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
        name={ScreenName.SwapFormSelectAccount}
        component={SwapFormSelectAccount}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader title={t("transfer.swap.title")} style={style} />
          ),
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapFormAmount}
        component={SwapFormAmount}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader title={t("transfer.swap.title")} style={style} />
          ),
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapSummary}
        component={SwapSummary}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader title={t("transfer.swap.title")} style={style} />
          ),
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapError}
        component={SwapError}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader title={t("transfer.swap.title")} style={style} />
          ),
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapPendingOperation}
        component={SwapPendingOperation}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader title={t("transfer.swap.title")} style={style} />
          ),
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapOperationDetails}
        component={SwapOperationDetails}
        options={({ navigation }) => ({
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader title={t("transfer.swap.title")} style={style} />
          ),
          headerLeft: () => <BackButton navigation={navigation} />,
          headerRight: null,
        })}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
