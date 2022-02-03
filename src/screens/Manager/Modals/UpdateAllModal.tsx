import React, { memo, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { Trans } from "react-i18next";
import type { InstalledItem } from "@ledgerhq/live-common/lib/apps";
import type { State, App } from "@ledgerhq/live-common/lib/types/manager";
import { useTheme } from "@react-navigation/native";

import { Flex, Icons, Text, Button } from "@ledgerhq/native-ui";

import ActionModal from "./ActionModal";

import AppIcon from "../AppsList/AppIcon";
import ByteSize from "../../../components/ByteSize";

const keyExtractor = (item: App, index: number) => String(item.id) + index;

type Props = {
  isOpened: boolean,
  apps: App[],
  installed: InstalledItem[],
  onClose: () => void,
  onConfirm: () => void,
  state: State,
};

const UpdateAllModal = ({
  isOpened,
  onClose,
  onConfirm,
  apps,
  installed,
  state,
 }: Props) => {
  const { colors } = useTheme();
  const { deviceInfo } = state;

  const data = apps.map(app => ({
    ...app,
    installed: installed.find(({ name }) => name === app.name),
  }));
  
  const renderAppLine = useCallback(
    ({
      item: { name, bytes, version: appVersion, installed },
      item,
    }: {
      item: App & { installed: InstalledItem | null | undefined },
    }) => {
      const version = (installed && installed.version) || appVersion;
      const availableVersion =
        (installed && installed.availableVersion) || appVersion;

      return (
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" style={[styles.appLine]}>
          <Flex flexDirection="row" alignItems="center" style={styles.appNameContainer}>
            <AppIcon size={32} radius={10} app={item} />
            <Text color="neutral.c100" fontWeight="semiBold" variant="body" numberOfLines={1} style={styles.appName}>
              {name}
            </Text>
          </Flex>
          <Flex flexDirection="row" justifyContent="space-between" style={{ width: "35%" }}>
            <Text color="neutral.c80" fontWeight="semiBold" variant="tiny" numberOfLines={1} style={styles.appLineVersion} borderColor="neutral.c40">
              {version}
            </Text>
            <Text color="neutral.c70" fontWeight="medium" variant="body" numberOfLines={1} style={styles.appLineSize}>
              <ByteSize
                value={bytes}
                deviceModel={state.deviceModel}
                firmwareVersion={deviceInfo.version}
              />
            </Text>
          </Flex>
        </Flex>
      );
    },
    [state.deviceModel, deviceInfo],
  );

  return (
    <ActionModal isOpened={!!isOpened} onClose={onClose} actions={[]}>
      <Flex style={styles.iconContainer} borderColor="neutral.c40">
        <Icons.RefreshMedium size={24} color="neutral.c100" />
      </Flex>
      <View style={styles.textContainer}>
        <Text
          color="neutral.c100"
          fontWeight="medium"
          variant="h2"
          style={styles.text}
        >
          <Trans i18nKey="v3.manager.update.subtitle" />
        </Text>
      </View>
      <FlatList
        style={[styles.list]}
        data={data}
        renderItem={renderAppLine}
        keyExtractor={keyExtractor}
        bounces={false}
        scrollEnabled
        scrollEventThrottle={50}
      />
      <Flex style={[styles.buttonsContainer]}>
        <Button size="large" type="main" onPress={onConfirm}>
          <Trans i18nKey="v3.manager.update.updateAll" />
        </Button>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text variant="large" fontWeight="semiBold" color="neutral.c100">
            <Trans i18nKey="common.cancel" />
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
  list: {
    width: "100%",
    maxHeight: 250,
    marginBottom: 20,
  },
  appLine: {
    marginBottom: 16,
  },
  appNameContainer: {
    width: "60%",
  },
  appName: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  appLineVersion: {
    marginRight: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  appLineSize: {
    textAlign: "right",
  },
});

export default memo(UpdateAllModal);
