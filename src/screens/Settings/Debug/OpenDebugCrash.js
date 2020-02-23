// @flow
import React from "react";
import { withNavigation } from "@react-navigation/compat";
import { ScreenName } from "../../../const";
import SettingsRow from "../../../components/SettingsRow";

const OpenDebugCrash = ({ navigation }: { navigation: * }) => (
  <SettingsRow
    title="Debug crash"
    onPress={() => navigation.navigate(ScreenName.DebugCrash)}
  />
);

export default withNavigation(OpenDebugCrash);
