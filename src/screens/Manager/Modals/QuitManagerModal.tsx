import React, { useMemo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import styled from "styled-components/native";
import { Flex, Icons, Text, Button } from "@ledgerhq/native-ui";

import ActionModal from "./ActionModal";

type Props = {
  isOpened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  installQueue: string[];
  uninstallQueue: string[];
};

const IconContainer = styled(Flex).attrs({
  marginVertical: 20,
  padding: 22,
  borderWidth: 1,
  borderRadius: 8,
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

const QuitManagerModal = ({
  isOpened,
  onConfirm,
  onClose,
  installQueue,
  uninstallQueue,
}: Props) => {
  const actionRunning = useMemo(
    () =>
      installQueue.length > 0
        ? uninstallQueue.length > 0
          ? "update"
          : "install"
        : "uninstall",
    [uninstallQueue.length, installQueue.length],
  );

  return (
    <ActionModal isOpened={!!isOpened} onClose={onClose} actions={[]}>
      <IconContainer borderColor="neutral.c40">
        <Icons.QuitMedium size={24} color="neutral.c100" />
      </IconContainer>
      <TextContainer>
        <ModalText color="neutral.c100" fontWeight="medium" variant="h2">
          <Trans i18nKey={`v3.errors.ManagerQuitPage.${actionRunning}.title`} />
        </ModalText>
        <ModalText color="neutral.c70" fontWeight="medium" variant="body">
          <Trans
            i18nKey={`v3.errors.ManagerQuitPage.${actionRunning}.description`}
          />
        </ModalText>
      </TextContainer>
      <ButtonsContainer>
        <Button size="large" type="main" onPress={onClose}>
          <Trans i18nKey="v3.common.continue" />
        </Button>
        <CancelButton onPress={onConfirm}>
          <Text variant="large" fontWeight="semiBold" color="neutral.c100">
            <Trans i18nKey="v3.errors.ManagerQuitPage.quit" />
          </Text>
        </CancelButton>
      </ButtonsContainer>
    </ActionModal>
  );
};

export default QuitManagerModal;
