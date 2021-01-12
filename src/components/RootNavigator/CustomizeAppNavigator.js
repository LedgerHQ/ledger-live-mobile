// @flow
import React, { useContext } from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName, NavigatorName } from "../../const";
import CustomizeAppPassword from "../../screens/CustomizeApp/Password";
import CustomizeAppCountervalues from "../../screens/CustomizeApp/Countervalues";
import CountervalueSettings from "../../screens/Settings/General/CountervalueSettings";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import StepHeader from "../StepHeader";
import { context as _ptContext } from "../../screens/ProductTour/Provider";
import { navigate } from "../../rootnavigation";
import colors from "../../colors";

const totalSteps = "2";

export default function ReceiveFundsNavigator() {
  const { t } = useTranslation();
  const ptContext = useContext(_ptContext);
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        ...closableStackNavigatorConfig,
        gestureEnabled: Platform.OS === "ios",
        headerStyle:
          ptContext.currentStep === "CUSTOMIZE_APP"
            ? { backgroundColor: colors.live }
            : {},
        headerTitleStyle:
          ptContext.currentStep === "CUSTOMIZE_APP"
            ? {
                color: colors.white,
              }
            : {},
        headerTintColor:
          ptContext.currentStep === "CUSTOMIZE_APP" ? colors.white : null,
        headerRight: null,
      }}
    >
      <Stack.Screen
        name={ScreenName.CustomizeAppPassword}
        component={CustomizeAppPassword}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("customizeapp.password.headerTitle")}
              subtitle={t("customizeapp.password.subtitle", {
                currentStep: "1",
                totalSteps,
              })}
              style={style}
            />
          ),
          headerLeft:
            ptContext.currentStep === "CUSTOMIZE_APP"
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
        name={ScreenName.CustomizeAppCountervalues}
        component={CustomizeAppCountervalues}
        options={() => ({
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("customizeapp.countervalues.headerTitle")}
              subtitle={t("customizeapp.countervalues.subtitle", {
                currentStep: "2",
                totalSteps,
              })}
              style={style}
            />
          ),
        })}
      />
      <Stack.Screen
        name={ScreenName.CustomizeAppCountervalueSettings}
        component={CountervalueSettings}
        options={{
          title: t("settings.display.counterValue"),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
