import React from "react";
import { Trans } from "react-i18next";

import ActionModal from "./ActionModal";
import styled from "styled-components/native";
import { Text, Flex, Icons } from "@ledgerhq/native-ui";

type Props = {
  isOpened: boolean;
  onClose: () => void;
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

const FirmwareUpdateModal = ({ isOpened, onClose }: Props) => (
  <ActionModal isOpened={!!isOpened} onClose={onClose} actions={[]}>
    <IconContainer borderColor="neutral.c40">
      <Icons.InfoMedium size={24} color="primary.c80" />
    </IconContainer>
    <TextContainer>
      <ModalText color="neutral.c100" fontWeight="medium" variant="h2">
        <Trans i18nKey="v3.manager.firmware.modalTitle" />
      </ModalText>
      <ModalText color="neutral.c70" fontWeight="medium" variant="body">
        <Trans i18nKey="v3.manager.firmware.modalDesc" />
      </ModalText>
    </TextContainer>
  </ActionModal>
);

export default FirmwareUpdateModal;
