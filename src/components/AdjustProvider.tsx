import React, { useEffect } from "react";

import { Adjust, AdjustEvent, AdjustConfig } from "react-native-adjust";
import Config from "react-native-config";
import { useSelector } from "react-redux";
import { analyticsEnabledSelector } from "../reducers/settings";

export default function AdjustProvider() {
  const analyticsEnabled: boolean = useSelector(analyticsEnabledSelector);

  useEffect(() => {
    const adjustConfig = new AdjustConfig(
      Config.ADJUST_APP_TOKEN,
      __DEV__
        ? AdjustConfig.EnvironmentSandbox
        : AdjustConfig.EnvironmentSandbox, // @TODO: Change to Production when ready
    );
    adjustConfig.setDelayStart(4.2);
    if (__DEV__) {
      adjustConfig.setLogLevel(AdjustConfig.LogLevelDebug);
    }
    Adjust.create(adjustConfig);

    return () => {
      Adjust.componentWillUnmount();
    };
  }, []);

  useEffect(() => {
    Adjust.setEnabled(analyticsEnabled);
  }, [analyticsEnabled]);

  return null;
}
