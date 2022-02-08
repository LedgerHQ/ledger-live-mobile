import React, { memo } from "react";
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

const VersionContainer = styled(Flex).attrs({
  borderRadius: 4,
  paddingHorizontal: 8,
  paddingVertical: 5.5,
})``;


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
            <VersionContainer backgroundColor={"neutral.c80"}>
              <Text variant={"subtitle"} fontWeight={"semiBold"} color={"neutral.c20"}>
                <Trans
                  i18nKey="v3.FirmwareVersionRow.subtitle"
                  values={{ version: deviceInfo.version }}
                />
              </Text>
            </VersionContainer>
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

export default memo(DeviceCard);
