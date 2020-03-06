import React, { useState, useCallback, useEffect, memo } from "react";

import { CommonActions } from "@react-navigation/native";
import { useApps } from "./shared";
import AppsScreen from "./AppsScreen";
import GenericErrorBottomModal from "../../components/GenericErrorBottomModal";
import { TrackScreen } from "../../analytics";
import QuitManagerModal from "./Modals/QuitManagerModal";
import StorageWarningModal from "./Modals/StorageWarningModal";
import AppDependenciesModal from "./Modals/AppDependenciesModal";
import UninstallDependenciesModal from "./Modals/UninstallDependenciesModal";
import { useLockNavigation } from "../../components/RootNavigator/CustomBlockRouterNavigator";

const MANAGER_TABS = {
  CATALOG: "CATALOG",
  INSTALLED_APPS: "INSTALLED_APPS",
};
interface Props {
  navigation: *;
  route: *;
}

const Manager = ({ navigation, route }: Props) => {
  const { appRes, deviceId, deviceInfo } = route.params.meta;

  const [unfilteredState, dispatch] = useApps(appRes, deviceId);

  const state = {
    deviceInfo: unfilteredState.deviceInfo,
    deviceModel: unfilteredState.deviceModel,
    firmware: unfilteredState.firmware,
    appByName: unfilteredState.appByName,
    apps: unfilteredState.apps,
    installedAvailable: unfilteredState.installedAvailable,
    installed: unfilteredState.installed,
    recentlyInstalledApps: unfilteredState.recentlyInstalledApps,
    installQueue: unfilteredState.installQueue,
    uninstallQueue: unfilteredState.uninstallQueue,
    updateAllQueue: unfilteredState.updateAllQueue,
    currentAppOp: unfilteredState.currentAppOp,
    currentError: unfilteredState.currentError,
  };

  const { apps, currentError, installQueue, uninstallQueue } = state;
  const blockNavigation = installQueue.length + uninstallQueue.length > 0;

  const currentProgress = unfilteredState.currentProgress;

  const [quitManagerAction, setQuitManagerAction] = useState(false);

  /** general error state */
  const [error, setError] = useState(null);
  /** storage warning modal state */
  const [storageWarning, setStorageWarning] = useState(null);
  /** install app with dependencies modal state */
  const [appInstallWithDependencies, setAppInstallWithDependencies] = useState(
    null,
  );
  /** uninstall app with dependencies modal state */
  const [
    appUninstallWithDependencies,
    setAppUninstallWithDependencies,
  ] = useState(null);

  /** open error modal each time a new error appears in state.currentError */
  useEffect(() => {
    if (currentError) {
      setError(currentError.error);
    }
  }, [setError, currentError]);

  // send informations to main router in order to lock navigation
  useLockNavigation(blockNavigation, setQuitManagerAction);

  /**
   * Resets the navigation params in order to unlock navigation
   * then trigger caught navigation action
   */
  const quitManager = useCallback(() => {
    navigation.dispatch({
      ...CommonActions.navigate(
        quitManagerAction.payload.name,
        quitManagerAction.payload.params,
      ),
      force: true, // custom navigation option to force redirect
    });
    setQuitManagerAction(null);
  }, [quitManagerAction, setQuitManagerAction, navigation]);

  const closeErrorModal = useCallback(() => setError(null), [setError]);

  const resetAppInstallWithDependencies = useCallback(() => {
    setAppInstallWithDependencies(null);
  }, [setAppInstallWithDependencies]);

  const resetAppUninstallWithDependencies = useCallback(() => {
    setAppUninstallWithDependencies(null);
  }, [setAppUninstallWithDependencies]);

  const closeQuitManagerModal = useCallback(() => setQuitManagerAction(null), [
    setQuitManagerAction,
  ]);

  return (
    <>
      <TrackScreen category="Manager" name="AppsList" />
      <AppsScreen
        state={state}
        dispatch={dispatch}
        navigation={navigation}
        currentProgress={currentProgress}
        setAppInstallWithDependencies={setAppInstallWithDependencies}
        setAppUninstallWithDependencies={setAppUninstallWithDependencies}
        setStorageWarning={setStorageWarning}
        managerTabs={MANAGER_TABS}
        deviceId={deviceId}
        initialDeviceName={route.params?.deviceName}
        blockNavigation={blockNavigation}
        deviceInfo={deviceInfo}
      />
      <GenericErrorBottomModal error={error} onClose={closeErrorModal} />
      <QuitManagerModal
        isOpened={quitManagerAction}
        onConfirm={quitManager}
        onClose={closeQuitManagerModal}
        installQueue={installQueue}
        uninstallQueue={uninstallQueue}
      />
      <StorageWarningModal
        warning={storageWarning}
        onClose={setStorageWarning}
      />
      <AppDependenciesModal
        appInstallWithDependencies={appInstallWithDependencies}
        onClose={resetAppInstallWithDependencies}
        appList={apps}
        dispatch={dispatch}
      />
      <UninstallDependenciesModal
        appUninstallWithDependencies={appUninstallWithDependencies}
        onClose={resetAppUninstallWithDependencies}
        dispatch={dispatch}
      />
    </>
  );
};

export default memo(Manager);
