import React from "react";
import { StyleSheet, View } from "react-native";
import { Trans } from "react-i18next";

import ActionModal from "./ActionModal";

import { Text, Flex, Icons } from "@ledgerhq/native-ui";

type Props = {
  isOpened: boolean;
  onClose: () => void;
};

const QuitManagerModal = ({ isOpened, onClose }: Props) => (
  <ActionModal isOpened={!!isOpened} onClose={onClose} actions={[]}>
    <Flex style={styles.iconContainer} borderColor="neutral.c40">
      <Icons.InfoMedium size={24} color="primary.c80" />
    </Flex>
    <View style={styles.textContainer}>
      <Text
        color="neutral.c100"
        fontWeight="medium"
        variant="h2"
        style={styles.text}
      >
        <Trans i18nKey="v3.manager.firmware.modalTitle" />
      </Text>
      <Text
        color="neutral.c70"
        fontWeight="medium"
        variant="body"
        style={styles.text}
      >
        <Trans i18nKey="v3.manager.firmware.modalDesc" />
      </Text>
    </View>
  </ActionModal>
);

const styles = StyleSheet.create({
  iconContainer: {
    marginVertical: 20,
    padding: 22,
    borderWidth: 1,
    borderRadius: 8,
  },
  text: {
    textAlign: "center",
    marginTop: 16,
  },
  textContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default QuitManagerModal;
