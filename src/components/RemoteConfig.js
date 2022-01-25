import { useEffect } from "react";
import remoteConfig from "@react-native-firebase/remote-config";

const defaultConfig = {
  feature_receive: true,
};

export const RemoteConfigProvider = ({ children }) => {
  useEffect(() => {
    const fetchConfig = async () => {
      await remoteConfig().setDefaults(defaultConfig);
      await remoteConfig().fetchAndActivate();
    };
    fetchConfig();
  }, []);

  return children;
};
