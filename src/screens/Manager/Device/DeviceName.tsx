import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Flex, Text } from "@ledgerhq/native-ui";
import { PenMedium } from "@ledgerhq/native-ui/assets/icons";
import styled from "styled-components/native";

import { deviceNameByDeviceIdSelectorCreator } from "../../../reducers/ble";
import Touchable from "../../../components/Touchable";
import { ScreenName } from "../../../const";

type Props = {
  deviceId: string;
  initialDeviceName: string;
  deviceModel: { id: string; productName: string };
  disabled: boolean;
};

const EditButton = styled(Touchable)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-left: ${p => p.theme.space[4]}px;
  padding-left: ${p => p.theme.space[2]}px;
  padding-right: ${p => p.theme.space[2]}px;
`;

export default function DeviceNameRow({
  deviceId,
  initialDeviceName,
  deviceModel: { id, productName },
  disabled,
}: Props) {
  const navigation = useNavigation();

  const savedName = useSelector(deviceNameByDeviceIdSelectorCreator(deviceId));

  const onPress = useCallback(
    () =>
      navigation.navigate(ScreenName.EditDeviceName, {
        deviceId,
        deviceName: savedName,
      }),
    [deviceId, navigation, savedName],
  );

  return (
    <Flex

      flexDirection={"row"}
      width={"100%"}
      flexWrap={"nowrap"}
      backgroundColor={"blue"}
    >
      <Text
        variant={"h2"}
        numberOfLines={1}
        ellipsizeMode="tail"
        backgroundColor={"red"}
        style={{flexBasis: 0, flex: 1}}
      >
        {savedName || initialDeviceName || productName}
      </Text>
      {id !== "nanoS" && (
        <EditButton
          onPress={onPress}
          activeOpacity={0.5}
          event="ManagerDeviceNameEdit"
          disabled={disabled}
        >
          <PenMedium size={22} color={"palette.neutral.c100"} />
        </EditButton>
      )}
    </Flex>
  );
}
