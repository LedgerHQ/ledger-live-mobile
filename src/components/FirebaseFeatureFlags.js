import React from "react";
import remoteConfig from "@react-native-firebase/remote-config";
import { FeatureFlagsProvider } from "@ledgerhq/live-common/lib/featureFlags";

import { formatFeatureId } from "./FirebaseRemoteConfig";

export const FirebaseFeatureFlagsProvider = ({ children }) => {
  const getFeature = key => {
    try {
      const value = remoteConfig().getValue(formatFeatureId(key));
      const feature = JSON.parse(value.asString());

      return feature;
    } catch (error) {
      console.error(`Failed to retrieve feature "${key}"`);
      return null;
    }
  };

  return (
    <FeatureFlagsProvider getFeature={getFeature}>
      {children}
    </FeatureFlagsProvider>
  );
};
