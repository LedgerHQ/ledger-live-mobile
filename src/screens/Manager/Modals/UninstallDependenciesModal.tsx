import React, { memo, useMemo, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";

import type { Action } from "@ledgerhq/live-common/lib/apps";
import type { App } from "@ledgerhq/live-common/lib/types/manager";

import { useTheme } from "styled-components/native";
import AppTree from "../../../icons/AppTree";

import ActionModal from "./ActionModal";
import styled from "styled-components/native";
import { Flex, Text, Button } from "@ledgerhq/native-ui";

type Props = {
  appUninstallWithDependencies: { app: App, dependents: App[] },
  dispatch: (action: Action) => void,
  onClose: () => void,
};

const ImageContainer = styled(Flex).attrs({
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "nowrap",
  marginVertical: 8,
  height: 90,
})``;

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

  return (
    <ActionModal isOpened={!!app} onClose={onClose} actions={[]}>
      {app && dependents.length && (
        <View style={{ width: "100%" }}>
          <ImageContainer>
            <AppTree size={160} color={colors.neutral.c40} icon={app.icon} app={app} />
          </ImageContainer>
          <TextContainer>
            <ModalText
              color="neutral.c100"
              fontWeight="medium"
              variant="h2"
            >
              <Trans
                i18nKey="v3.AppAction.uninstall.dependency.title"
                values={{ app: name }}
              />
            </ModalText>
            <ModalText
              color="neutral.c70"
              fontWeight="medium"
              variant="body"
            >
              <Trans
                i18nKey="v3.AppAction.uninstall.dependency.description_two"
                values={{ app: name }}
              />
            </ModalText>
          </TextContainer>
          <ButtonsContainer>
            <Button size="large" type="error" onPress={unInstallApp}>
              <Trans
                i18nKey="AppAction.uninstall.continueUninstall"
                values={{ app: name }}
              />
            </Button>
            <CancelButton onPress={onClose}>
              <Text variant="large" fontWeight="semiBold" color="neutral.c100">
                <Trans i18nKey="common.cancel" />
              </Text>
            </CancelButton>
          </ButtonsContainer>
        </View>
      )}
    </ActionModal>
  );
};

export default memo(UninstallDependenciesModal);
