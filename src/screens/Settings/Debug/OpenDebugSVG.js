// @flow
import React from "react";
import { withNavigation } from "@react-navigation/compat";
import { ScreenName } from "../../../const";
import SettingsRow from "../../../components/SettingsRow";

const OpenDebugSVG = ({ navigation }: { navigation: * }) => (
  <SettingsRow
    title="Debug SVG"
    onPress={() => navigation.navigate(ScreenName.DebugSVG)}
  />
);

export default withNavigation(OpenDebugSVG);
