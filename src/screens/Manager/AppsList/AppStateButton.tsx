import React, { useMemo, memo } from "react";
import { StyleSheet, View } from "react-native";

import { Trans } from "react-i18next";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { Action, State } from "@ledgerhq/live-common/lib/apps";


import AppInstallButton from "./AppInstallButton";
import AppUninstallButton from "./AppUninstallButton";
import AppUpdateButton from "./AppUpdateButton";

import AppProgressButton from "./AppProgressButton";

type Props = {
  app: App,
  state: State,
  dispatch: (action: Action) => void,
  notEnoughMemoryToInstall: boolean,
  isInstalled: boolean,
  setAppInstallWithDependencies: (params: { app: App, dependencies: App[] }) => void,
  setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
};

const AppStateButton = ({
  app,
  state,
  dispatch,
  notEnoughMemoryToInstall,
  isInstalled,
  setAppInstallWithDependencies,
  setAppUninstallWithDependencies,
}: Props) => {
  const { installed, installQueue, uninstallQueue, updateAllQueue } = state;
  const { name } = app;

  const installing = useMemo(() => installQueue.includes(name), [
    installQueue,
    name,
  ]);

  const updating = useMemo(() => updateAllQueue.includes(name), [
    updateAllQueue,
    name,
  ]);

  const uninstalling = useMemo(() => uninstallQueue.includes(name), [
    uninstallQueue,
    name,
  ]);

  const canUpdate = useMemo(
    () => installed.some(({ name, updated }) => name === app.name && !updated),
    [app.name, installed],
  );

  const renderAppState = () => {
    switch (true) {
      case installing:
        return <AppProgressButton state={state} name={name} installing />;
      case uninstalling:
        return <AppProgressButton state={state} name={name} />;
      case updating:
        return <AppProgressButton state={state} name={name} updating />;
      case canUpdate:
        return (
          <AppUpdateButton
            app={app}
            state={state}
            dispatch={dispatch}
          />
        );
      case isInstalled:
        return (
          <AppUninstallButton
            app={app}
            state={state}
            dispatch={dispatch}
            setAppUninstallWithDependencies={setAppUninstallWithDependencies}
          />
        );
      default:
        return (
          <AppInstallButton
            state={state}
            dispatch={dispatch}
            app={app}
            notEnoughMemoryToInstall={notEnoughMemoryToInstall}
            setAppInstallWithDependencies={setAppInstallWithDependencies}
          />
        );
    }
  };

  return <View style={styles.root}>{renderAppState()}</View>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  appStateText: {
    fontSize: 13,
    lineHeight: 16,
  },
  installedLabel: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    alignContent: "center",
    borderRadius: 4,
    overflow: "hidden",
    paddingHorizontal: 0,
    flexWrap: "wrap",
    height: 38,
  },
  noWrapLabel: {
    flexWrap: "nowrap",
    overflow: "visible",
  },
  updateText: {
    width: "100%",
    textAlign: "right",
  },
  installedText: {
    paddingLeft: 8,
  },
});

export default memo(AppStateButton);
