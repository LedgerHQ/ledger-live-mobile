// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation, Trans } from "react-i18next";
import { ScreenName } from "../../const";
import FirmwareUpdateReleaseNotes from "../../screens/FirmwareUpdate/01-ReleaseNotes";
import FirmwareUpdateCheckId from "../../screens/FirmwareUpdate/02-CheckId";
import FirmwareUpdateMCU from "../../screens/FirmwareUpdate/03-MCU";
import FirmwareUpdateConfirmation from "../../screens/FirmwareUpdate/04-Confirmation";
import FirmwareUpdateFailure from "../../screens/FirmwareUpdate/04-Failure";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import StepHeader from "../StepHeader";

export default function FirmwareUpdateNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{ ...closableStackNavigatorConfig, headerShown: false }}
    >
      <Stack.Screen
        name={ScreenName.FirmwareUpdateReleaseNotes}
        component={FirmwareUpdateReleaseNotes}
        options={{
          headerTitle: t("FirmwareUpdate.title"),
        }}
      />
      <Stack.Screen
        name={ScreenName.FirmwareUpdateCheckId}
        component={FirmwareUpdateCheckId}
        options={{
          headerLeft: null,
          headerTitle: (
            <StepHeader
              subtitle={<Trans i18nKey="FirmwareUpdate.title" />}
              title={<Trans i18nKey="FirmwareUpdateCheckId.title" />}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.FirmwareUpdateMCU}
        component={FirmwareUpdateMCU}
        options={{
          headerLeft: null,
          headerTitle: (
            <StepHeader
              subtitle={<Trans i18nKey="FirmwareUpdate.title" />}
              title={<Trans i18nKey="FirmwareUpdateMCU.title" />}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.FirmwareUpdateConfirmation}
        component={FirmwareUpdateConfirmation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.FirmwareUpdateFailure}
        component={FirmwareUpdateFailure}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
