// @flow
import React from "react";
import { withNavigation } from "@react-navigation/compat";
import { ScreenName } from "../../../const";
import SettingsRow from "../../../components/SettingsRow";

const OpenLottie = ({ navigation }: { navigation: * }) => (
  <SettingsRow
    title="Debug Lottie"
    onPress={() => navigation.navigate(ScreenName.DebugLottie)}
  />
);

export default withNavigation(OpenLottie);
