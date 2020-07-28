// @flow

import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { getProviders } from "@ledgerhq/live-common/lib/swap";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/swap/types";
import MissingSwapApp from "./MissingSwapApp";
import Landing from "./Landing";
import NotAvailable from "./NotAvailable";
import Form from "./Form";
import Connect from "./Connect";
import colors from "../../colors";

type MaybeProviders = ?(AvailableProvider[]);

const Swap = () => {
  const [providers, setProviders] = useState<MaybeProviders>();
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [meta, setMeta] = useState({});
  const [installedApps, setInstalledApps] = useState();
  const { navigate } = useNavigation();
  const route = useRoute();

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const onSetResult = useCallback(
    data => {
      if (!data) return;
      const { deviceId, deviceName, appRes } = data;
      const { installed } = appRes;
      setInstalledApps(installed);
      setMeta({ deviceId, deviceName });
    },
    [setMeta, setInstalledApps],
  );

  const showInstallSwap =
    installedApps && !installedApps.some(a => a.name === "Bitcoin");
  // ↑ FIXME Use swap once we have swap app for real

  const onContinue = useCallback(() => {
    setShowLandingPage(false);
  }, [setShowLandingPage]);

  return (
    <View style={styles.root}>
      {!providers ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : !providers.length ? (
        <NotAvailable />
      ) : showLandingPage ? (
        <Landing providers={providers} onContinue={onContinue} />
      ) : !installedApps ? (
        <Connect setResult={onSetResult} />
      ) : showInstallSwap ? (
        <MissingSwapApp />
      ) : (
        <Form installedApps={installedApps} meta={meta} providers={providers} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectDevice: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 20,
  },
  debugText: {
    marginBottom: 10,
  },
});

export default Swap;
