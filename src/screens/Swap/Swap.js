// @flow

import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { getProviders } from "@ledgerhq/live-common/lib/swap";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/swap/types";
import { useSelector } from "react-redux";
import { hasAcceptedSwapKYCSelector } from "../../reducers/settings";
import MissingSwapApp from "./MissingSwapApp";
import Landing from "./Landing";
import NotAvailable from "./NotAvailable";
import Form from "./Form";
import Connect from "./Connect";
import colors from "../../colors";

type MaybeProviders = ?(AvailableProvider[]);

const Swap = () => {
  const [providers, setProviders] = useState<MaybeProviders>();
  const hasAcceptedSwapKYC = useSelector(hasAcceptedSwapKYCSelector);
  const [deviceMeta, setDeviceMeta] = useState();

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const onSetResult = useCallback(
    data => {
      if (!data) return;
      setDeviceMeta(data);
    },
    [setDeviceMeta],
  );

  const showInstallSwap =
    deviceMeta?.appRes?.installed &&
    !deviceMeta?.appRes?.installed.some(a => a.name === "Exchange");

  return (
    <View style={styles.root}>
      {!providers ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : !providers.length ? (
        <NotAvailable />
      ) : !hasAcceptedSwapKYC ? (
        <Landing providers={providers} />
      ) : !deviceMeta?.appRes?.installed ? (
        <Connect setResult={onSetResult} />
      ) : showInstallSwap ? (
        <MissingSwapApp />
      ) : deviceMeta ? (
        <Form deviceMeta={deviceMeta} providers={providers} />
      ) : null}
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
