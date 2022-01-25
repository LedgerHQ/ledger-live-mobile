import remoteConfig from "@react-native-firebase/remote-config";

const FeatureToggle = ({ feature, fallback, children }) => {
  const isActive = remoteConfig()
    .getValue(feature)
    .asBoolean();

  if (!isActive) {
    return fallback;
  }

  return children;
};

export default FeatureToggle;
