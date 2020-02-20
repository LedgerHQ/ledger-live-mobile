// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import FirmwareUpdateReleaseNotes from "../../screens/FirmwareUpdate/01-ReleaseNotes";
import FirmwareUpdateCheckId from "../../screens/FirmwareUpdate/02-CheckId";
import FirmwareUpdateMCU from "../../screens/FirmwareUpdate/03-MCU";
import FirmwareUpdateConfirmation from "../../screens/FirmwareUpdate/04-Confirmation";
import FirmwareUpdateFailure from "../../screens/FirmwareUpdate/04-Failure";

export default function FirmwareUpdateStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenName.FirmwareUpdateReleaseNotes}
        component={FirmwareUpdateReleaseNotes}
      />
      <Stack.Screen
        name={ScreenName.FirmwareUpdateCheckId}
        component={FirmwareUpdateCheckId}
      />
      <Stack.Screen
        name={ScreenName.FirmwareUpdateMCU}
        component={FirmwareUpdateMCU}
      />
      <Stack.Screen
        name={ScreenName.FirmwareUpdateConfirmation}
        component={FirmwareUpdateConfirmation}
      />
      <Stack.Screen
        name={ScreenName.FirmwareUpdateFailure}
        component={FirmwareUpdateFailure}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
