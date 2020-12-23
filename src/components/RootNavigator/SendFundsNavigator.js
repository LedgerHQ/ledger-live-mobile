// @flow
import React, { useContext } from "react";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName, NavigatorName } from "../../const";
import SendFundsMain from "../../screens/SendFunds/01-SelectAccount";
import SendSelectRecipient from "../../screens/SendFunds/02-SelectRecipient";
import SendAmount from "../../screens/SendFunds/03-Amount";
import SendSummary from "../../screens/SendFunds/04-Summary";
import SelectDevice from "../../screens/SelectDevice";
import SendConnectDevice from "../../screens/ConnectDevice";
import SendValidationSuccess from "../../screens/SendFunds/07-ValidationSuccess";
import SendValidationError from "../../screens/SendFunds/07-ValidationError";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import StepHeader from "../StepHeader";
import { context as _ptContext } from "../../screens/ProductTour/Provider";
import { navigate } from "../../rootnavigation";
import colors from "../../colors";

const totalSteps = "6";

export default function SendFundsNavigator() {
  const { t } = useTranslation();
  const ptContext = useContext(_ptContext);
  return (
    <Stack.Navigator
      screenOptions={{
        ...closableStackNavigatorConfig,
        headerStyle:
          ptContext.currentStep === "SEND_COINS"
            ? { backgroundColor: colors.live }
            : {},
        headerTitleStyle:
          ptContext.currentStep === "SEND_COINS"
            ? {
                color: colors.white,
              }
            : {},
        headerTintColor:
          ptContext.currentStep === "SEND_COINS" ? colors.white : null,
        headerRight: null,
      }}
    >
      <Stack.Screen
        name={ScreenName.SendFundsMain}
        component={SendFundsMain}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("send.stepperHeader.selectAccount")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "1",
                totalSteps,
              })}
              style={style}
            />
          ),
          headerLeft:
            ptContext.currentStep === "SEND_COINS"
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
        name={ScreenName.SendSelectRecipient}
        component={SendSelectRecipient}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("send.stepperHeader.recipientAddress")}
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
        name={ScreenName.SendAmount}
        component={SendAmount}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("send.stepperHeader.selectAmount")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "3",
                totalSteps,
              })}
              style={style}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.SendSummary}
        component={SendSummary}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("send.stepperHeader.summary")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "4",
                totalSteps,
              })}
              style={style}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.SendSelectDevice}
        component={SelectDevice}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("send.stepperHeader.selectDevice")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "5",
                totalSteps,
              })}
              style={style}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.SendConnectDevice}
        component={SendConnectDevice}
        options={{
          headerTitle: ({ style }: { style: * }) => (
            <StepHeader
              title={t("send.stepperHeader.connectDevice")}
              subtitle={t("send.stepperHeader.stepRange", {
                currentStep: "6",
                totalSteps,
              })}
              style={style}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.SendValidationSuccess}
        component={SendValidationSuccess}
        options={{
          headerLeft: null,
          headerShown: false,
          headerRight: null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.SendValidationError}
        component={SendValidationError}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
