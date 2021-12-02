import React, { memo, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, View, Image, Linking } from "react-native";
import { Trans } from "react-i18next";

import type { State, AppsDistribution } from "@ledgerhq/live-common/lib/apps";

import manager from "@ledgerhq/live-common/lib/manager";

import { Badge, Box, Button, Flex, Text } from "@ledgerhq/native-ui";
import { CircledCheckMedium } from "@ledgerhq/native-ui/assets/icons";
import styled, { useTheme } from "styled-components/native";
import LText from "../../../components/LText";
import Genuine from "../../../icons/Genuine";
import FirmwareUpdateModal from "../Modals/FirmwareUpdateModal";
import DeviceAppStorage from "./DeviceAppStorage";

import NanoS from "../../../images/devices/NanoS";
import NanoX from "../../../images/devices/NanoX";

import { urls } from "../../../config/urls";
import Card from "../../../components/Card";

import DeviceName from "./DeviceName";
import { setAvailableUpdate } from "../../../actions/settings";
import Touchable from "../../../components/Touchable";

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
  margin-left: ${(p) => p.theme.space[5]}px;
  margin-right: ${(p) => p.theme.space[5]}px;
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
  const [firmware, setFirmware] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  const open = useCallback(() => setOpenModal(true), [setOpenModal]);
  const close = useCallback(() => setOpenModal(false), [setOpenModal]);
  const openSupport = useCallback(() => Linking.openURL(urls.contact), []);

  useEffect(() => {
    async function getLatestFirmwareForDevice() {
      const fw = await manager.getLatestFirmwareForDevice(deviceInfo);

      if (fw) {
        dispatch(setAvailableUpdate(true));
        setFirmware(fw);
      } else {
        dispatch(setAvailableUpdate(false));
        setFirmware(null);
      }
    }

    getLatestFirmwareForDevice();
  }, [deviceInfo, dispatch]);

  const isDeprecated = manager.firmwareUnsupported(deviceModel.id, deviceInfo);

  return (
    <>
      <BorderCard>
        {firmware ? (
          <View style={styles.firmwareBanner}>
            <LText primary semiBold style={styles.firmwareBannerText}>
              <Trans
                i18nKey="manager.firmware.latest"
                values={{ version: firmware.final.name }}
              />
            </LText>
            <View style={styles.firmwareBannerCTA}>
              <Button
                type="main"
                onPress={open}
                size={'small'}
              ><Trans i18nKey="common.moreInfo" /></Button>
            </View>
          </View>
        ) : isDeprecated ? (
          <Box
            backgroundColor={'primary.c20'}
            p={4}
            mt={6}
          >
            <Text
              variant={'body'}
            >
              <Trans i18nKey="manager.firmware.outdated" />
            </Text>
              <Button
                type="main"
                onPress={openSupport}
              ><Trans i18nKey="common.contactUs" /></Button>
          </Box>
        ) : null}
        <Flex flexDirection={"row"} mx={4} mb={8}>
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
            <Badge badgeVariant={'primary'} active>
              <Trans
              i18nKey="FirmwareVersionRow.subtitle"
              values={{ version: deviceInfo.version }}
            />
            </Badge>
          </Flex>
        </Flex>

          <DeviceAppStorage
            distribution={distribution}
            deviceModel={deviceModel}
            deviceInfo={deviceInfo}
          />
      </BorderCard>
      <FirmwareUpdateModal isOpened={openModal} onClose={close} />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 265,
    flexDirection: "column",
    paddingHorizontal: 16,
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
