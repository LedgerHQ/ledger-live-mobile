import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Flex, Text } from "@ledgerhq/native-ui";
import { PenMedium } from "@ledgerhq/native-ui/assets/icons";

import { deviceNameByDeviceIdSelectorCreator } from "../../../reducers/ble";
import { ScreenName } from "../../../const";
import { TouchableOpacity } from "react-native";

type Props = {
  deviceId: string;
  initialDeviceName: string;
  deviceModel: { id: string; productName: string };
  disabled: boolean;
};

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
    <Flex flexDirection={"row"} flexWrap={"nowrap"}>
      <Text variant={"h2"} numberOfLines={1} ellipsizeMode="tail">
        {savedName || initialDeviceName || productName}
      </Text>
      {id !== "nanoS" && (
        <Flex
          ml={3}
          backgroundColor={"palette.primary.c30"}
          borderRadius={50}
          width={24}
          height={24}
          alignItems="center"
          justifyContent="center"
        >
          <TouchableOpacity onPress={onPress} disabled={disabled}>
            <PenMedium size={13} color={"palette.primary.c80"}/>
          </TouchableOpacity>
        </Flex>
      )}
    </Flex>
  );
}
