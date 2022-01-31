import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";

import type { Action } from "@ledgerhq/live-common/lib/apps";
import type { App } from "@ledgerhq/live-common/lib/types/manager";

import { hasInstalledAnyAppSelector } from "../../../reducers/settings";
import { installAppFirstTime } from "../../../actions/settings";
import AppIcon from "../AppsList/AppIcon";

import ActionModal from "./ActionModal";

import { Flex, Icons, Text, Button } from "@ledgerhq/native-ui";

type Props = {
  appInstallWithDependencies: { app: App, dependencies: App[] },
  dispatch: (action: Action) => void,
  onClose: () => void,
};

function AppDependenciesModal({
  appInstallWithDependencies,
  dispatch: dispatchProps,
  onClose,
}: Props) {
  const dispatch = useDispatch();
  const hasInstalledAnyApp = useSelector(hasInstalledAnyAppSelector);

  const { app, dependencies = [] } = appInstallWithDependencies || {};
  const { name } = app || {};

  const installAppDependencies = useCallback(() => {
    if (!hasInstalledAnyApp) {
      dispatch(installAppFirstTime(true));
    }
    dispatchProps({ type: "install", name });
    onClose();
  }, [dispatch, dispatchProps, onClose, name, hasInstalledAnyApp]);

 return (
  <ActionModal isOpened={!!app} onClose={onClose} actions={[]}>
    {!!dependencies.length && (
      <>
        <Flex style={styles.iconContainer} borderColor="neutral.c40">
          <AppIcon app={app} size={40} />
          <Text style={[styles.separator]} color="neutral.c40">- - -</Text>
          <Flex style={styles.linkIconContainer} backgroundColor="neutral.c30">
            <Icons.LinkMedium size={16} color="neutral.c80" />
          </Flex>
          <Text style={[styles.separator]} color="neutral.c40">- - -</Text>
          <AppIcon app={dependencies[0]} size={40} />
        </Flex>
        <View style={styles.textContainer}>
          <Text
            color="neutral.c100"
            fontWeight="medium"
            variant="h2"
            style={styles.text}
          >
            <Trans
                i18nKey="v3.AppAction.install.dependency.title"
                values={{ dependency: dependencies[0].name }}
              />
          </Text>
          <Text
            color="neutral.c70"
            fontWeight="medium"
            variant="body"
            style={styles.text}
          >
            <Trans
                i18nKey="v3.AppAction.install.dependency.description_one"
                values={{ dependency: dependencies[0].name, app: name }}
              />
          </Text>
        </View>
        <Flex style={[styles.buttonsContainer]}>
          <Button size="large" type="main" onPress={installAppDependencies}>
            <Trans i18nKey="v3.AppAction.install.continueInstall" />
          </Button>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text variant="large" fontWeight="semiBold" color="neutral.c100">
              <Trans i18nKey="common.cancel" />
            </Text>
          </TouchableOpacity>
        </Flex>
      </>
    )}
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

export default memo(AppDependenciesModal);
