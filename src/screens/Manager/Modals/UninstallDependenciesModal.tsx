import React, { memo, useMemo, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";

import type { Action } from "@ledgerhq/live-common/lib/apps";
import type { App } from "@ledgerhq/live-common/lib/types/manager";

import { useTheme } from "styled-components/native";
import AppTree from "../../../icons/AppTree";

import getWindowDimensions from "../../../logic/getWindowDimensions";

import ActionModal from "./ActionModal";

import { Flex, Text, Button } from "@ledgerhq/native-ui";

const { height } = getWindowDimensions();

const LINE_HEIGHT = 46;

type Props = {
  appUninstallWithDependencies: { app: App, dependents: App[] },
  dispatch: (action: Action) => void,
  onClose: () => void,
};

const UninstallDependenciesModal = ({
  appUninstallWithDependencies,
  dispatch,
  onClose,
}: Props) => {
  const { colors } = useTheme();
  const { app, dependents = [] } = appUninstallWithDependencies || {};
  const { name } = app || {};

  const unInstallApp = useCallback(() => {
    dispatch({ type: "uninstall", name });
    onClose();
  }, [dispatch, onClose, name]);

  const modalActions = useMemo(
    () => [
      {
        title: (
          <Trans
            i18nKey="AppAction.uninstall.continueUninstall"
            values={{ app: name }}
          />
        ),
        onPress: unInstallApp,
        type: "alert",
        event: "ManagerAppDepsUninstallConfirm",
        eventProperties: { appName: name },
      },
      {
        title: <Trans i18nKey="common.close" />,
        onPress: onClose,
        type: "secondary",
        outline: false,
        event: "ManagerAppDepsUninstallCancel",
        eventProperties: { appName: name },
      },
    ],
    [unInstallApp, onClose, name],
  );

  return (
    <ActionModal isOpened={!!app} onClose={onClose} actions={[]}>
      {app && dependents.length && (
        <View style={styles.container}>
          <View style={styles.imageSection}>
            <AppTree size={160} color={colors.neutral.c40} icon={app.icon} app={app} />
          </View>
          <View style={styles.textContainer}>
            <Text
              color="neutral.c100"
              fontWeight="medium"
              variant="h2"
              style={styles.text}
            >
              <Trans
                i18nKey="v3.AppAction.uninstall.dependency.title"
                values={{ app: name }}
              />
            </Text>
            <Text
              color="neutral.c70"
              fontWeight="medium"
              variant="body"
              style={styles.text}
            >
              <Trans
                i18nKey="v3.AppAction.uninstall.dependency.description_two"
                values={{ app: name }}
              />
            </Text>
          </View>
          <Flex style={[styles.buttonsContainer]}>
            <Button size="large" type="error" onPress={unInstallApp}>
              <Trans
                i18nKey="AppAction.uninstall.continueUninstall"
                values={{ app: name }}
              />
            </Button>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text variant="large" fontWeight="semiBold" color="neutral.c100">
                <Trans i18nKey="common.cancel" />
              </Text>
            </TouchableOpacity>
          </Flex>
        </View>
      )}
    </ActionModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  imageSection: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
    marginVertical: 8,
    height: 90,
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

export default memo(UninstallDependenciesModal);
