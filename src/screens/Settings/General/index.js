/* @flow */
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TrackScreen } from "../../../analytics";
import CountervalueSettingsRow from "./CountervalueSettingsRow";
import AuthSecurityToggle from "./AuthSecurityToggle";
import ReportErrorsRow from "./ReportErrorsRow";
import AnalyticsRow from "./AnalyticsRow";
import HideEmptyTokenAccountsRow from "./HideEmptyTokenAccountsRow";

export default function GeneralSettings() {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <TrackScreen category="Settings" name="General" />
      <CountervalueSettingsRow />
      <HideEmptyTokenAccountsRow />
      <AuthSecurityToggle />
      <ReportErrorsRow />
      <AnalyticsRow />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { paddingTop: 16, paddingBottom: 64 },
});
