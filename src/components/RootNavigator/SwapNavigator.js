// @flow

import React, { useContext, useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import SwapSummary from "../../screens/Swap/Form/Summary";
import SwapError from "../../screens/Swap/Form/Error";
import SwapFormAmount from "../../screens/Swap/Form/Amount";
import SwapFormOrHistory from "../../screens/Swap/FormOrHistory";
import SwapOperationDetails from "../../screens/Swap/OperationDetails";
import { BackButton } from "../../screens/OperationDetails";
import SwapPendingOperation from "../../screens/Swap/Form/PendingOperation";
import SwapFormSelectCrypto from "../../screens/Swap/Form/SelectAccount/01-SelectCrypto";
import SwapFormSelectAccount from "../../screens/Swap/Form/SelectAccount/02-SelectAccount";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import StepHeader from "../StepHeader";
import { context as _ptContext } from "../../screens/ProductTour/Provider";

import styles from "../../navigation/styles";

export default function SwapNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );
  const ptContext = useContext(_ptContext);
  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavigationConfig,
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
          headerStyle: styles.headerNoShadow,
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
