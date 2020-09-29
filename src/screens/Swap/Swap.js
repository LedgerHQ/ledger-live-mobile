// @flow

import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { getProviders } from "@ledgerhq/live-common/lib/swap";
import { SwapNoAvailableProviders } from "@ledgerhq/live-common/lib/errors";
import { useSelector } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { hasAcceptedSwapKYCSelector } from "../../reducers/settings";
import MissingOrOutdatedSwapApp from "./MissingOrOutdatedSwapApp";
import Landing from "./Landing";
import NotAvailable from "./NotAvailable";
import Form from "./Form";
import Connect from "./Connect";
import colors from "../../colors";

const Swap = () => {
  const [providers, setProviders] = useState();
  const [error, setProvidersError] = useState();
  const hasAcceptedSwapKYC = useSelector(hasAcceptedSwapKYCSelector);
  const [deviceMeta, setDeviceMeta] = useState();

  useEffect(() => {
    if (providers === undefined) {
      getProviders().then(maybeProviders => {
        if (maybeProviders instanceof SwapNoAvailableProviders) {
          setProvidersError(maybeProviders);
        } else {
          setProviders(providers);
        }
      });
    }
  }, [providers]);

  const onSetResult = useCallback(
    data => {
      if (!data) return;
      setDeviceMeta(data);
    },
    [setDeviceMeta],
  );

  const exchangeApp = deviceMeta?.result?.installed.find(
    a => a.name === "Exchange",
  );
  return (
    <SafeAreaView style={styles.root}>
      {error ? (
        <NotAvailable />
      ) : !providers ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : !hasAcceptedSwapKYC ? (
        <Landing providers={providers} />
      ) : !deviceMeta?.result?.installed ? (
        <Connect setResult={onSetResult} />
      ) : !exchangeApp ? (
        <MissingOrOutdatedSwapApp />
      ) : !exchangeApp.updated ? (
        <MissingOrOutdatedSwapApp outdated />
      ) : deviceMeta ? (
        <Form deviceMeta={deviceMeta} providers={providers} />
      ) : null}
    </SafeAreaView>
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
