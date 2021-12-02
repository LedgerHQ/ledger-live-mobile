import React, { memo, useMemo } from "react";

import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";

import { DeviceModel } from "@ledgerhq/devices";
import { AppsDistribution } from "@ledgerhq/live-common/lib/apps";
import { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import { Box, Flex, Text } from "@ledgerhq/native-ui";
import { WarningMedium } from "@ledgerhq/native-ui/assets/icons";

import { useTheme } from "styled-components/native";
import LText from "../../../components/LText";

import Warning from "../../../icons/Warning";
import Touchable from "../../../components/Touchable";
import ByteSize from "../../../components/ByteSize";

type Props = {
  deviceModel: DeviceModel;
  deviceInfo: DeviceInfo;
  distribution: AppsDistribution;
};

const DeviceAppStorage = ({
  deviceModel,
  deviceInfo,
  distribution: {
    freeSpaceBytes,
    appsSpaceBytes,
    shouldWarnMemory,
    totalAppsBytes,
    apps,
  },
}: Props) => {
  const { colors } = useTheme();
  const appSizes = useMemo(
    () =>
      apps.filter(Boolean).map(({ bytes, currency, name }) => ({
        name,
        ratio: Number((bytes / appsSpaceBytes) * 100).toFixed(2),
        color: (currency && currency.color) || "#000000",
      })),
    [apps, appsSpaceBytes],
  );

  const storageWarnStyle = {
    color: shouldWarnMemory ? colors.lightOrange : colors.darkBlue,
  };

  return (
    /* Fixme: Storage info line might be too tight with some translation, consider putting it on multiple lines */
    <Box>
      <Flex
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mx={5}
        mb={3}
      >
        <Flex flexDirection={"row"} alignItems={"center"}>
          <Text
            variant={"small"}
            fontWeight={"medium"}
            color={"palette.neutral.c100"}
            mr={3}
          >
            <Text
              variant={"small"}
              fontWeight={"medium"}
              color={"palette.neutral.c80"}
            >
              Used
            </Text>{" "}
            <ByteSize
              value={freeSpaceBytes}
              deviceModel={deviceModel}
              firmwareVersion={deviceInfo.version}
            />
          </Text>
          <Text
            variant={"small"}
            fontWeight={"medium"}
            color={"palette.neutral.c80"}
          >
            <Trans
              count={apps.length}
              values={{ number: apps.length }}
              i18nKey="manager.storage.appsInstalled"
            >
              <Text
                variant={"small"}
                fontWeight={"medium"}
                color={"palette.neutral.c100"}
              >
                {"placeholder"}
              </Text>
              <Text
                variant={"small"}
                fontWeight={"medium"}
                color={"palette.neutral.c80"}
              >
                {"placeholder"}
              </Text>
            </Trans>
          </Text>
        </Flex>
        <Flex flexDirection={"row"} alignItems={"center"}>
          {shouldWarnMemory && (
            <WarningMedium color={"palette.warning.c60"} size={14} />
          )}
          <Text
            variant={"small"}
            fontWeight={"medium"}
            color={"palette.neutral.c80"}
          >
            <ByteSize
              value={freeSpaceBytes}
              deviceModel={deviceModel}
              firmwareVersion={deviceInfo.version}
            />{" "}
            <Trans i18nKey="manager.storage.storageAvailable" />
          </Text>
        </Flex>
      </Flex>
      <Touchable
        activeOpacity={1}
        style={[
          styles.row,
          styles.graphRow,
          { backgroundColor: colors.neutral.c40 },
        ]}
        onPress={() => {}}
        event="ManagerAppDeviceGraphClick"
      >
        {appSizes.map(({ ratio, color, name }, i) => (
          <Box
            key={`${i}${name}`}
            backgroundColor={color}
            flexBasis={`${ratio}%`}
            flexShrink={1}
            flexGrow={0.005}
            height={"100%"}
          />
        ))}
      </Touchable>
    </Box>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  graphRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexBasis: 12,
    height: 12,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    overflow: "hidden",
  },
});

export default memo(DeviceAppStorage);
