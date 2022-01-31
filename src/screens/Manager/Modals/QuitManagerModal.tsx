import React, { useMemo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";

import { Flex, Icons, Text, Button } from "@ledgerhq/native-ui";

import ActionModal from "./ActionModal";

type Props = {
  isOpened: boolean,
  onClose: () => void,
  onConfirm: () => void,
  installQueue: string[],
  uninstallQueue: string[],
};

const QuitManagerModal = ({
  isOpened,
  onConfirm,
  onClose,
  installQueue,
  uninstallQueue,
}: Props) => {
  const { colors } = useTheme();

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
      <Flex style={styles.iconContainer} borderColor="neutral.c40">
        <Icons.QuitMedium size={24} color="neutral.c100" />
      </Flex>
      <View style={styles.textContainer}>
        <Text
          color="neutral.c100"
          fontWeight="medium"
          variant="h2"
          style={styles.text}
        >
          <Trans i18nKey={`v3.errors.ManagerQuitPage.${actionRunning}.title`} />
        </Text>
        <Text
          color="neutral.c70"
          fontWeight="medium"
          variant="body"
          style={styles.text}
        >
          <Trans
            i18nKey={`v3.errors.ManagerQuitPage.${actionRunning}.description`}
          />
        </Text>
      </View>
      <Flex style={[styles.buttonsContainer]}>
        <Button size="large" type="main" onPress={onClose}>
          <Trans i18nKey="v3.common.continue" />
        </Button>
        <TouchableOpacity style={styles.cancelButton} onPress={onConfirm}>
          <Text variant="large" fontWeight="semiBold" color="neutral.c100">
            <Trans i18nKey="v3.errors.ManagerQuitPage.quit" />
          </Text>
        </TouchableOpacity>
      </Flex>
    </ActionModal>
  );
};

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

export default QuitManagerModal;
