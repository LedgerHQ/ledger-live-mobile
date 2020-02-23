// @flow
import React from "react";
import { withNavigation } from "@react-navigation/compat";
import { ScreenName } from "../../../const";
import SettingsRow from "../../../components/SettingsRow";

const OpenDebugHttpTransport = ({ navigation }: { navigation: * }) => (
  <SettingsRow
    title="Debug http transport"
    onPress={() => navigation.navigate(ScreenName.DebugHttpTransport)}
  />
);

export default withNavigation(OpenDebugHttpTransport);
