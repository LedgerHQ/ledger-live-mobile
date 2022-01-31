import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";

import { Flex, Icons, Text, Button } from "@ledgerhq/native-ui";

import ActionModal from "./ActionModal";

type Props = {
  isOpened: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const UninstallAllModal = ({ isOpened, onClose, onConfirm }: Props) => (
  <ActionModal isOpened={!!isOpened} onClose={onClose} actions={[]}>
    <Flex style={styles.iconContainer} borderColor="neutral.c40">
      <Icons.TrashMedium size={24} color="error.c100" />
    </Flex>
    <View style={styles.textContainer}>
      <Text
        color="neutral.c100"
        fontWeight="medium"
        variant="h2"
        style={styles.text}
      >
        <Trans i18nKey="v3.manager.uninstall.subtitle" />
      </Text>
      <Text
        color="neutral.c70"
        fontWeight="medium"
        variant="body"
        style={styles.text}
      >
        <Trans i18nKey="v3.manager.uninstall.description" />
      </Text>
    </View>
    <Flex style={[styles.buttonsContainer]}>
      <Button size="large" type="error" onPress={onConfirm}>
        <Trans i18nKey="v3.manager.uninstall.uninstallAll" />
      </Button>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text variant="large" fontWeight="semiBold" color="neutral.c100">
          <Trans i18nKey="common.cancel" />
        </Text>
      </TouchableOpacity>
    </Flex>
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
});

export default memo(UninstallAllModal);
