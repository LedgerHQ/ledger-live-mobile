// @flow
import React from "react";
import { withNavigation } from "@react-navigation/compat";
import { ScreenName } from "../../../const";
import SettingsRow from "../../../components/SettingsRow";

const BenchmarkQRStream = ({ navigation }: { navigation: * }) => (
  <SettingsRow
    title="Benchmark QRStream"
    onPress={() => navigation.navigate(ScreenName.BenchmarkQRStream)}
  />
);

export default withNavigation(BenchmarkQRStream);
