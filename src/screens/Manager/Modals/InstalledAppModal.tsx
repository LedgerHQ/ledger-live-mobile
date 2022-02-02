import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, Linking, View } from "react-native";
import { Trans } from "react-i18next";

import type { State } from "@ledgerhq/live-common/lib/apps";
import { isLiveSupportedApp } from "@ledgerhq/live-common/lib/apps/logic";

import { urls } from "../../../config/urls";

import { NavigatorName } from "../../../const";

import AppIcon from "../AppsList/AppIcon";

import ActionModal from "./ActionModal";
import { Flex, Text, Button } from "@ledgerhq/native-ui";

type Props = {
  state: State,
  navigation: any,
  disable: boolean,
};

const InstallSuccessBar = ({ state, navigation, disable }: Props) => {
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

  const app = useMemo(
    () => (successInstalls && successInstalls.length > 0 && successInstalls[0]) || {},
    [successInstalls],
  );

  const onClose = useCallback(() => setHasBeenShown(true), []);

  return (
    <ActionModal isOpened={successInstalls.length >= 1} onClose={onClose} actions={[]}>
        <AppIcon app={app} size={48} radius={14} />
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
            {hasLiveSupported
              ? (
                <Trans
                  i18nKey="v3.AppAction.install.done.description"
                  values={{ app: app.name }}
                />
              ) : (
              <Trans
                i18nKey="manager.installSuccess.notSupported"
              />
            )}
          </Text>
        </View>
        <Flex style={[styles.buttonsContainer]}>
          {hasLiveSupported
            ? (
              <Button size="large" type="main" onPress={onAddAccount}>
                <Trans i18nKey="v3.AppAction.install.done.accounts" />
              </Button>
            ) : (
            <Button size="large" type="main" onPress={onSupportLink}>
              <Trans i18nKey="manager.installSuccess.learnMore" />
            </Button>
          )}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text variant="large" fontWeight="semiBold" color="neutral.c100">
              <Trans i18nKey="common.cancel" />
            </Text>
          </TouchableOpacity>
        </Flex>
  </ActionModal>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginVertical: 20,
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

export default InstallSuccessBar;
