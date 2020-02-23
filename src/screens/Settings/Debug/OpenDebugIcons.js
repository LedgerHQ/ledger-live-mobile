// @flow
import React from "react";
import { withNavigation } from "@react-navigation/compat";
import { ScreenName } from "../../../const";
import SettingsRow from "../../../components/SettingsRow";

const OpenDebugIcons = ({ navigation }: { navigation: * }) => (
  <SettingsRow
    title="Debug icons"
    onPress={() => navigation.navigate(ScreenName.DebugIcons)}
  />
);

export default withNavigation(OpenDebugIcons);
