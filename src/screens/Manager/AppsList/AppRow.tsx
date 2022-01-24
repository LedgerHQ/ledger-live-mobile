import React, { memo, useMemo, useCallback } from "react";

import { View, StyleSheet } from "react-native";

import type { App } from "@ledgerhq/live-common/lib/types/manager";

import type { State, Action } from "@ledgerhq/live-common/lib/apps";
import { useNotEnoughMemoryToInstall } from "@ledgerhq/live-common/lib/apps/react";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import LText from "../../../components/LText";
import Touchable from "../../../components/Touchable";
import Warning from "../../../icons/Warning";
import AppIcon from "./AppIcon";

import AppStateButton from "./AppStateButton";
import ByteSize from "../../../components/ByteSize";

import { Flex, Text } from "@ledgerhq/native-ui";

type Props = {
  app: App,
  state: State,
  dispatch: (action: Action) => void,
  isInstalledView: boolean,
  setAppInstallWithDependencies: (params: { app: App, dependencies: App[] }) => void,
  setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
  setStorageWarning: () => void,
  managerTabs: any,
  optimisticState: State,
};

const AppRow = ({
  app,
  state,
  dispatch,
  isInstalledView,
  setAppInstallWithDependencies,
  setAppUninstallWithDependencies,
  setStorageWarning,
  optimisticState,
}: Props) => {
  const { name, bytes, version: appVersion, displayName } = app;
  const { installed, deviceInfo } = state;

  const isInstalled = useMemo(() => installed.find(i => i.name === name), [
    installed,
    name,
  ]);

  const version = (isInstalled && isInstalled.version) || appVersion;
  const availableVersion =
    (isInstalled && isInstalled.availableVersion) || appVersion;

  const notEnoughMemoryToInstall = useNotEnoughMemoryToInstall(
    optimisticState,
    name,
  );

  const onSizePress = useCallback(() => setStorageWarning(name), [
    setStorageWarning,
    name,
  ]);

  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <View style={[styles.item]}>
        <AppIcon app={app} size={48} />
        <View style={styles.labelContainer}>
          <Text numberOfLines={1} variant="body" fontWeight="semiBold" color="neutral.c100">
            {displayName}
          </Text>
          <Flex style={styles.versionContainer} borderColor="neutral.c50">
            <Text numberOfLines={1} variant="tiny" color="neutral.c80" fontWeight="semiBold">
              {version}
              {isInstalled && !isInstalled.updated && (
                <>
                  {" "}
                  <Trans
                    i18nKey="manager.appList.versionNew"
                    values={{
                      newVersion:
                        availableVersion !== version ? ` ${availableVersion}` : "",
                    }}
                  />
                </>
              )}
            </Text>
          </Flex>
        </View>
        {!isInstalled && notEnoughMemoryToInstall ? (
          <Touchable
            activeOpacity={0.5}
            onPress={onSizePress}
            style={styles.warnText}
            event="ManagerAppNotEnoughMemory"
            eventProperties={{ appName: name }}
          >
            <Warning size={16} color={colors.lightOrange} />
            <LText
              semiBold
              style={[styles.versionText, styles.sizeText, styles.warnText]}
              color="grey"
            >
              <ByteSize
                value={bytes}
                deviceModel={state.deviceModel}
                firmwareVersion={deviceInfo.version}
              />
            </LText>
          </Touchable>
        ) : (
          <LText
            style={[
              styles.versionText,
              styles.sizeText,
              notEnoughMemoryToInstall ? styles.warnText : {},
            ]}
            color={notEnoughMemoryToInstall ? "lightOrange" : "grey"}
          >
            <ByteSize
              value={bytes}
              deviceModel={state.deviceModel}
              firmwareVersion={deviceInfo.version}
            />
          </LText>
        )}
        <AppStateButton
          app={app}
          state={state}
          dispatch={dispatch}
          notEnoughMemoryToInstall={notEnoughMemoryToInstall}
          isInstalled={!!isInstalled}
          isInstalledView={isInstalledView}
          setAppInstallWithDependencies={setAppInstallWithDependencies}
          setAppUninstallWithDependencies={setAppUninstallWithDependencies}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 64,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 14,
    borderRadius: 0,
    height: 64,
  },
  labelContainer: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "40%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  versionContainer: {
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  sizeText: {
    fontSize: 12,
    width: 44,
    marginHorizontal: 10,
  },
  warnText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  installedLabel: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 4,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  appButton: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
    alignItems: "flex-start",
    height: 38,
    paddingHorizontal: 10,
    paddingVertical: 12,
    zIndex: 5,
  },
});

export default memo(AppRow);
