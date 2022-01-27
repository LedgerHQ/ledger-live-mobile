import { useEffect } from "react";
import remoteConfig from "@react-native-firebase/remote-config";
import { defaultFeatures } from "@ledgerhq/live-common/lib/featureFlags";
import { reduce } from "lodash";

export const formatFeatureId = id => `feature_${id}`;

// Firebase SDK treat JSON values as strings
const formatDefaultFeatures = config =>
  reduce(
    config,
    (acc, feature, featureId) => ({
      ...acc,
      [formatFeatureId(featureId)]: JSON.stringify(feature),
    }),
    {},
  );

export const FirebaseRemoteConfigProvider = ({ children }) => {
  useEffect(() => {
    const fetchConfig = async () => {
      await remoteConfig().setDefaults({
        ...formatDefaultFeatures(defaultFeatures),
      });
      await remoteConfig().fetchAndActivate();
    };
    fetchConfig();
  }, []);

  return children;
};
