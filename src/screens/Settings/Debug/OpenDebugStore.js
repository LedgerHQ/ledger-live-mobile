// @flow
import React from "react";
import { withNavigation } from "@react-navigation/compat";
import { ScreenName } from "../../../const";
import SettingsRow from "../../../components/SettingsRow";

const OpenDebugStore = ({ navigation }: { navigation: * }) => (
  <SettingsRow
    title="Debug store"
    onPress={() => navigation.navigate(ScreenName.DebugStore)}
  />
);

export default withNavigation(OpenDebugStore);
