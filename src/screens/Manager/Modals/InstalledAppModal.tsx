import React, { useState, useCallback, useMemo } from "react";
import { TouchableOpacity, Linking } from "react-native";
import { Trans } from "react-i18next";

import type { State } from "@ledgerhq/live-common/lib/apps";
import { isLiveSupportedApp } from "@ledgerhq/live-common/lib/apps/logic";

import { urls } from "../../../config/urls";

import { NavigatorName } from "../../../const";

import AppIcon from "../AppsList/AppIcon";

import styled from "styled-components/native";
import ActionModal from "./ActionModal";
import { Flex, Text, Button } from "@ledgerhq/native-ui";

type Props = {
  state: State,
  navigation: any,
  disable: boolean,
};

const TextContainer = styled(Flex).attrs({
  marginTop: 4,
  marginBottom: 32,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
})``;

const ModalText = styled(Text).attrs({
  textAlign: "center",
  marginTop: 16,
})``;

const ButtonsContainer = styled(Flex).attrs({
  marginBottom: 24,
  width: "100%",
})``;

const CancelButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  margin-top: 25;
`;

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
        <TextContainer>
          <ModalText
            color="neutral.c100"
            fontWeight="medium"
            variant="h2"
          >
            <Trans
              i18nKey="v3.AppAction.install.done.title"
            />
          </ModalText>
          <ModalText
            color="neutral.c70"
            fontWeight="medium"
            variant="body"
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
          </ModalText>
        </TextContainer>
        <ButtonsContainer>
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
          <CancelButton onPress={onClose}>
            <Text variant="large" fontWeight="semiBold" color="neutral.c100">
              <Trans i18nKey="common.cancel" />
            </Text>
          </CancelButton>
        </ButtonsContainer>
  </ActionModal>
  );
};

export default InstallSuccessBar;
