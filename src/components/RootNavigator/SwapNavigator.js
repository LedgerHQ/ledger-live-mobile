// @flow

import React, { useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import SwapSummary from "../../screens/Swap/FormOrHistory/Form/Summary";
import SwapError from "../../screens/Swap/FormOrHistory/Form/Error";
import SwapFormAmount from "../../screens/Swap/FormOrHistory/Form/Amount";
import SwapProviders from "../../screens/Swap";
import SwapFormOrHistory from "../../screens/Swap/FormOrHistory";
import SwapOperationDetails from "../../screens/Swap/FormOrHistory/OperationDetails";
import { BackButton } from "../../screens/OperationDetails";
import SwapPendingOperation from "../../screens/Swap/FormOrHistory/Form/PendingOperation";
import SwapFormSelectCrypto from "../../screens/Swap/FormOrHistory/Form/SelectAccount/01-SelectCrypto";
import SwapFormSelectAccount from "../../screens/Swap/FormOrHistory/Form/SelectAccount/02-SelectAccount";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";
import StepHeader from "../StepHeader";
import WebPlatformPlayer from "../WebPlatformPlayer";

export default function SwapNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );
  return (
    <Stack.Navigator screenOptions={stackNavigationConfig}>
      <Stack.Screen
        name={ScreenName.SwapProviders}
        component={SwapProviders}
        options={{
          headerStyle: styles.headerNoShadow,
          title: t("transfer.swap.landing.header"),
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapDapp}
        component={WebPlatformPlayer}
        options={({ route }) => ({
          headerStyle: styles.headerNoShadow,
          title: route.params.manifest?.name,
        })}
      />
      <Stack.Screen
        name={ScreenName.SwapFormOrHistory}
        component={SwapFormOrHistory}
        options={{
          headerStyle: styles.headerNoShadow,
          title: t("transfer.swap.landing.header"),
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapFormSelectCrypto}
        component={SwapFormSelectCrypto}
        options={{
          headerTitle: () => <StepHeader title={t("transfer.swap.title")} />,
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapFormSelectAccount}
        component={SwapFormSelectAccount}
        options={{
          headerTitle: () => <StepHeader title={t("transfer.swap.title")} />,
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapFormAmount}
        component={SwapFormAmount}
        options={{
          headerTitle: () => <StepHeader title={t("transfer.swap.title")} />,
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapSummary}
        component={SwapSummary}
        options={{
          headerTitle: () => <StepHeader title={t("transfer.swap.title")} />,
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapError}
        component={SwapError}
        options={{
          headerTitle: () => <StepHeader title={t("transfer.swap.title")} />,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapPendingOperation}
        component={SwapPendingOperation}
        options={{
          headerTitle: () => <StepHeader title={t("transfer.swap.title")} />,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.SwapOperationDetails}
        component={SwapOperationDetails}
        options={({ navigation }) => ({
          headerTitle: () => <StepHeader title={t("transfer.swap.title")} />,
          headerLeft: () => <BackButton navigation={navigation} />,
          headerRight: null,
        })}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
