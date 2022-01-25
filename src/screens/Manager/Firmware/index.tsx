import React, { memo, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, TouchableOpacity, Touchable, Linking } from "react-native";
import { Trans } from "react-i18next";

import type { State } from "@ledgerhq/live-common/lib/apps";

import manager from "@ledgerhq/live-common/lib/manager";

import { Box, Text, Flex, Icons } from "@ledgerhq/native-ui";
import FirmwareUpdateModal from "../Modals/FirmwareUpdateModal";

import { urls } from "../../../config/urls";

import { setAvailableUpdate } from "../../../actions/settings";

type Props = {
  state: State,
  deviceInfo: any,
};

const FirmwareManager = ({
  state,
  deviceInfo,
}: Props) => {
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
        {firmware ? (
          <Flex style={[styles.firmwareUpdate]} borderColor="neutral.c40">
            <Text color="neutral.c100" variant="large" fontWeight="semiBold">
                <Trans i18nKey="v3.manager.firmware.latest"/>
            </Text>
            <TouchableOpacity onPress={open}>
                <Box style={[styles.firmareUpdateInfoButton]} borderColor="neutral.c40">
                    <Icons.InfoMedium size={16} color="neutral.c100"/>
                </Box>
            </TouchableOpacity>
          </Flex>
        ) : isDeprecated ? (
        <Flex style={[styles.firmwareOutdated]} backgroundColor="warning.c30">
            <Icons.CircledAlertMedium size={18} color="warning.c100"/>
            <Flex flexDirection="column" ml={3}>
                <Text color="warning.c100" variant="body" fontWeight="medium">
                    <Trans i18nKey="v3.manager.firmware.outdated"/>
                </Text>
                <TouchableOpacity onPress={openSupport} style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                    <Text color="warning.c100" variant="body" fontWeight="medium" style={{ textDecorationLine: "underline" }} mr={3}>
                        <Trans i18nKey="v3.manager.firmware.contactUs" />
                    </Text>
                    <Icons.ExternalLinkMedium size={14} color="warning.c100" />
                </TouchableOpacity>
            </Flex>
          </Flex>
        ) : null}
      <FirmwareUpdateModal isOpened={openModal} onClose={close} />
    </>
  );
};

const styles = StyleSheet.create({
  firmwareUpdate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    marginTop: 16,
  },
  firmareUpdateInfoButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  firmwareOutdated: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 4,
    padding: 16,
    paddingRight: 16,
    marginTop: 16,
  },
  firmwareBannerCTA: {
    paddingLeft: 48,
  },
});

export default memo(FirmwareManager);
