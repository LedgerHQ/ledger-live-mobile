import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Trans } from "react-i18next";

import type { State, AppsDistribution } from "@ledgerhq/live-common/lib/apps";

import { Flex, Text } from "@ledgerhq/native-ui";
import { CircledCheckMedium } from "@ledgerhq/native-ui/assets/icons";
import styled, { useTheme } from "styled-components/native";
import DeviceAppStorage from "./DeviceAppStorage";

import NanoS from "../../../images/devices/NanoS";
import NanoX from "../../../images/devices/NanoX";

import DeviceName from "./DeviceName";

const illustrations = {
  nanoS: NanoS,
  nanoSP: NanoS,
  nanoX: NanoX,
  blue: NanoS,
};

type Props = {
  distribution: AppsDistribution,
  state: State,
  deviceId: string,
  initialDeviceName: string,
  blockNavigation: boolean,
  deviceInfo: any,
};

const BorderCard = styled.View`
  flex-direction: column;
  border: 1px solid ${p => p.theme.colors.neutral.c40};
  border-radius: 4px;
`;


const DeviceCard = ({
  distribution,
  state,
  deviceId,
  initialDeviceName,
  blockNavigation,
  deviceInfo,
}: Props) => {
  const { colors } = useTheme();
  const { deviceModel } = state;

  return (
      <BorderCard>
        <Flex flexDirection={"row"} mt={24} mx={4} mb={8}>
            { illustrations[deviceModel.id]({color: colors.neutral.c100}) }
          <Flex flex={1} flexDirection={'column'} alignItems={'flex-start'} ml={4}>
              <DeviceName
                deviceId={deviceId}
                deviceModel={deviceModel}
                initialDeviceName={initialDeviceName}
                disabled={blockNavigation}
              />
            <Flex flexDirection={"row"} alignItems={'center'} mt={2} mb={3}>
              <Text variant={'body'} fontWeight={'medium'} color={'palette.neutral.c80'} numberOfLines={1} mr={3}><Trans i18nKey="DeviceItemSummary.genuine" /></Text>
              <CircledCheckMedium size={18} color={'palette.success.c80'} />
            </Flex>
            <Flex style={styles.versionContainer} backgroundColor={"neutral.c80"}>
              <Text variant={"subtitle"} fontWeight={"semiBold"} color={"neutral.c20"}>
                <Trans
                  i18nKey="v3.FirmwareVersionRow.subtitle"
                  values={{ version: deviceInfo.version }}
                />
              </Text>
            </Flex>
          </Flex>
        </Flex>

          <DeviceAppStorage
            distribution={distribution}
            deviceModel={deviceModel}
            deviceInfo={deviceInfo}
          />
      </BorderCard>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 8,
    marginBottom: 32,
  },
  card: {
    minHeight: 265,
    flexDirection: "column",
    marginTop: 16,
  },
  capacityText: { fontSize: 13 },
  deviceSection: {
    height: 119,
    flexDirection: "row",
  },
  deviceImageContainer: {
backgroundColor: 'blue'
  },
  deviceImage: {
    flex: 1,
    width: "100%",
  },
  deviceInfoContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  deviceNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  deviceName: {
    marginRight: 10,
    fontSize: 16,
  },
  deviceFirmware: {
    fontSize: 13,
    paddingRight: 8,
  },
  versionContainer: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5.5,
  },
  deviceCapacity: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  storageSection: {
    flex: 1,
    paddingVertical: 20,
  },
  separator: {
    width: "100%",
    height: 1,
  },
  firmwareBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    padding: 12,
  },
  firmwareBannerText: {
    flex: 1,
    fontWeight: "600",
  },
  firmwareBannerCTA: {
    paddingLeft: 48,
  },
});

export default memo(DeviceCard);
