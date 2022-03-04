import React, { memo, useCallback, useState } from "react";
import { Trans } from "react-i18next";

import type { State, AppsDistribution, Action } from "@ledgerhq/live-common/lib/apps";
import type { App } from "@ledgerhq/live-common/lib/types/manager";

import { Flex, Text, Button } from "@ledgerhq/native-ui";
import { CircledCheckMedium } from "@ledgerhq/native-ui/assets/icons";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import DeviceAppStorage from "./DeviceAppStorage";

import NanoS from "../../../images/devices/NanoS";
import NanoX from "../../../images/devices/NanoX";

import DeviceName from "./DeviceName";

import { ScreenName } from "../../../const";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";

const illustrations = {
  nanoS: NanoS,
  nanoSP: NanoS,
  nanoX: NanoX,
  blue: NanoS,
};

type Props = {
  distribution: AppsDistribution,
  state: State,
  result: ListAppsResult,
  deviceId: string,
  initialDeviceName: string,
  blockNavigation: boolean,
  deviceInfo: any,
  setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
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
  result,
  deviceId,
  initialDeviceName,
  blockNavigation,
  deviceInfo,
  setAppUninstallWithDependencies,
}: Props) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { deviceModel } = state;

  const [illustration] = useState(illustrations[deviceModel.id]({color: colors.neutral.c100}));

  const onMyAppsPress = useCallback(() => {
    navigation.navigate(ScreenName.ManagerMyApps, {
      result,
      illustration,
      deviceInfo,
      deviceId,
      setAppUninstallWithDependencies,
    });
  }, [navigation, result, illustration, deviceInfo, deviceId, setAppUninstallWithDependencies]);

  return (
      <BorderCard>
        <Flex flexDirection={"row"} mt={24} mx={4} mb={8}>
            { illustration }
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
        <Flex mx={6} mb={6}>
          <Button size="small" type="color" onPress={onMyAppsPress}>
            <Trans i18nKey="v3.manager.myApps" />
          </Button>
        </Flex>
      </BorderCard>
  );
};

export default memo(DeviceCard);
