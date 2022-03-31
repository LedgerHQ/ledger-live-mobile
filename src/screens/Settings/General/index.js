/* @flow */
import React from "react";
import { TrackScreen } from "../../../analytics";
import CountervalueSettingsRow from "./CountervalueSettingsRow";
import ThemeSettingsRow from "./ThemeSettingsRow";
import AuthSecurityToggle from "./AuthSecurityToggle";
import ReportErrorsRow from "./ReportErrorsRow";
import AnalyticsRow from "./AnalyticsRow";
import CarouselRow from "./CarouselRow";
import LanguageRow from "./LanguageRow";
import RegionRow from "./RegionRow";
import NavigationScrollView from "../../../components/NavigationScrollView";

export default function GeneralSettings() {
  return (
    <NavigationScrollView>
      <TrackScreen category="Settings" name="General" />
      <CountervalueSettingsRow />
      <LanguageRow />
      <RegionRow />
      <ThemeSettingsRow />
      <AuthSecurityToggle />
      <ReportErrorsRow />
      <AnalyticsRow />
      <CarouselRow />
    </NavigationScrollView>
  );
}
