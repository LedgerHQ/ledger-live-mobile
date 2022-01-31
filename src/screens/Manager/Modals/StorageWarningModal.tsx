import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Trans } from "react-i18next";

import { Text, Flex, Icons, Button } from "@ledgerhq/native-ui";

import ActionModal from "./ActionModal";

type Props = {
  warning: boolean;
  onClose: () => void;
};

const StorageWarningModal = ({ warning, onClose }: Props) => (
  <ActionModal isOpened={!!warning} onClose={onClose} actions={[]}>
    <Flex style={styles.iconContainer} borderColor="neutral.c40">
      <Icons.StorageMedium size={24} color="error.c100" />
    </Flex>
    <View style={styles.textContainer}>
      <Text
        color="neutral.c100"
        fontWeight="medium"
        variant="h2"
        style={styles.text}
      >
        <Trans i18nKey="v3.errors.ManagerNotEnoughSpace.title" />
      </Text>
      <Text
        color="neutral.c70"
        fontWeight="medium"
        variant="body"
        style={styles.text}
      >
        <Trans
          i18nKey="v3.errors.ManagerNotEnoughSpace.info"
          values={{ app: warning }}
        />
      </Text>
    </View>
    <Flex style={[styles.buttonsContainer]}>
      <Button size="large" type="main" onPress={onClose}>
        <Trans i18nKey="v3.errors.ManagerNotEnoughSpace.continue" />
      </Button>
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
    marginVertical: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    marginTop: 24,
    marginBottom: 4,
    width: "100%",
  },
});

export default memo(StorageWarningModal);
