/*
import React, { useState, useCallback, useMemo } from "react";
import { Linking } from "react-native";
import { Trans } from "react-i18next";

import type { State } from "@ledgerhq/live-common/lib/apps";
import { isLiveSupportedApp } from "@ledgerhq/live-common/lib/apps/logic";

import { useTheme } from "@react-navigation/native";
import { urls } from "../../../config/urls";

import { NavigatorName } from "../../../const";
import ToastBar from "../../../components/ToastBar";

type Props = {
  state: State,
  navigation: *,
  disable: boolean,
};

const InstallSuccessBar = ({ state, navigation, disable }: Props) => {
  const { colors } = useTheme();
  const [hasBeenShown, setHasBeenShown] = useState(disable);
  const {
    installQueue,
    uninstallQueue,
    recentlyInstalledApps,
    appByName,
    installed,
  } = state;

  const onAddAccount = useCallback(() => {
    navigation.navigate(NavigatorName.AddAccounts);
    setHasBeenShown(true);
  }, [navigation]);

  const onSupportLink = useCallback(() => {
    Linking.openURL(urls.appSupport);
    setHasBeenShown(true);
  }, []);

  const successInstalls = useMemo(
    () =>
      !hasBeenShown && installQueue.length <= 0 && uninstallQueue.length <= 0
        ? recentlyInstalledApps
            .filter(appName => installed.some(({ name }) => name === appName))
            .map(name => appByName[name])
        : [],
    [
      appByName,
      hasBeenShown,
      installQueue.length,
      recentlyInstalledApps,
      uninstallQueue.length,
      installed,
    ],
  );

  const hasLiveSupported = useMemo(
    () => successInstalls.find(isLiveSupportedApp),
    [successInstalls],
  );

  const onClose = useCallback(() => setHasBeenShown(true), []);

  return (
    <ToastBar
      isOpened={successInstalls.length >= 1}
      onClose={onClose}
      containerStyle={{ backgroundColor: colors.live }}
      type={"primary"}
      title={
        <>
          {hasLiveSupported ? (
            successInstalls.length === 1 ? (
              <Trans
                i18nKey="manager.installSuccess.title"
                values={{ app: successInstalls[0].name }}
              />
            ) : (
              <Trans i18nKey="manager.installSuccess.title_plural" />
            )
          ) : (
            <Trans i18nKey="manager.installSuccess.notSupported" />
          )}
        </>
      }
      secondaryAction={{
        title: <Trans i18nKey="manager.installSuccess.later" />,
        onPress: onClose,
      }}
      primaryAction={
        hasLiveSupported
          ? {
              title: <Trans i18nKey="manager.installSuccess.manageAccount" />,
              useTouchable: true,
              onPress: onAddAccount,
              event: "ManagerAddAccount",
            }
          : {
              title: <Trans i18nKey="manager.installSuccess.learnMore" />,
              onPress: onSupportLink,
            }
      }
    />
  );
};

export default InstallSuccessBar;

*/

import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";

import type { State } from "@ledgerhq/live-common/lib/apps";

import { NavigatorName } from "../../../const";

import type { Action } from "@ledgerhq/live-common/lib/apps";
import type { App } from "@ledgerhq/live-common/lib/types/manager";

import { hasInstalledAnyAppSelector } from "../../../reducers/settings";
import { installAppFirstTime } from "../../../actions/settings";
import AppIcon from "../AppsList/AppIcon";

import ActionModal from "./ActionModal";

import { isLiveSupportedApp } from "@ledgerhq/live-common/lib/apps/logic";

import { Flex, Text, Button } from "@ledgerhq/native-ui";

type Props = {
  state: State,
  navigation: any,
  onClose: () => void,
};

function AppInstalledModal({
  state,
  navigation,
  onClose,
}: Props) {
  const {
    installQueue,
    uninstallQueue,
    recentlyInstalledApps,
    appByName,
    installed,
  } = state;

  const onAddAccount = useCallback(() => {
    navigation.navigate(NavigatorName.AddAccounts);
    onClose();
  }, [navigation, onClose]);

  const successInstalls = useMemo(
    () =>
      installQueue.length <= 0 && uninstallQueue.length <= 0
        ? recentlyInstalledApps
            .filter(appName => installed.some(({ name }) => name === appName))
            .map(name => appByName[name])
        : [],
    [
      appByName,
      installQueue.length,
      recentlyInstalledApps,
      uninstallQueue.length,
      installed,
    ],
  );

  const hasLiveSupported = useMemo(
    () => successInstalls.find(isLiveSupportedApp),
    [successInstalls],
  );

  console.log("-----------------");
  console.log(successInstalls);
  console.log("-----------------");

 return (
  <ActionModal isOpened={successInstalls && successInstalls.length > 0} onClose={onClose} actions={[]}>
    <Flex style={styles.iconContainer} borderColor="neutral.c40">
      <AppIcon app={successInstalls[0]} size={48} radius={14} />
    </Flex>
    <View style={styles.textContainer}>
      <Text
        color="neutral.c100"
        fontWeight="medium"
        variant="h2"
        style={styles.text}
      >
        <Trans
          i18nKey="v3.AppAction.install.done.title"
        />
      </Text>
      <Text
        color="neutral.c70"
        fontWeight="medium"
        variant="body"
        style={styles.text}
      >
        <Trans
          i18nKey="v3.AppAction.install.done.description"
          values={{ app: successInstalls[0].name }}
        />
      </Text>
    </View>
    <Flex style={[styles.buttonsContainer]}>
      <Button size="large" type="main" onPress={onAddAccount}>
        <Trans i18nKey="v3.AppAction.install.done.accounts" />
      </Button>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text variant="large" fontWeight="semiBold" color="neutral.c100">
          <Trans i18nKey="common.cancel" />
        </Text>
      </TouchableOpacity>
    </Flex>
  </ActionModal>
 );
}

const styles = StyleSheet.create({
  separator: {
    marginHorizontal: 6,
  },
  iconContainer: {
    marginVertical: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
  },
  text: {
    textAlign: "center",
    marginTop: 16,
  },
  textContainer: {
    marginTop: 4,
    marginBottom: 32,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    marginBottom: 24,
    width: "100%",
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  linkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(AppInstalledModal);
