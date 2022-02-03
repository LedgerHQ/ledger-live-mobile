import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";

import type { State } from "@ledgerhq/live-common/lib/apps";

import { NavigatorName } from "../../../const";

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
