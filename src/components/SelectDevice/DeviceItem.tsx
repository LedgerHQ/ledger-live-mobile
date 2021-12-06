import React, { memo, useMemo, useCallback } from "react";
import invariant from "invariant";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { useTheme } from "@react-navigation/native";
import IconNanoX from "../../icons/NanoX";
import USB from "../../icons/USB";
import { NanoFoldedMedium } from "@ledgerhq/native-ui/assets/icons";

import Item from "./Item";
import { Flex, SelectableList, Text } from "@ledgerhq/native-ui";
import { useTranslation } from "react-i18next";

type Props = {
  deviceMeta: Device,
  disabled?: boolean,
  withArrow?: boolean,
  description?: React.Node,
  onSelect?: (arg0: Device) => any,
  onBluetoothDeviceAction?: (arg0: Device) => any,
};

const iconByFamily = {
  httpdebug: ({ color }: { color: string }) => (
    <Icon style={styles.specialIcon} color={color} name="terminal" size={16} />
  ),
  usb: ({ color }: { color: string }) => <USB color={color} />,
};

function DeviceItem({
  deviceMeta,
  onSelect,
  disabled,
  description,
  withArrow,
  onBluetoothDeviceAction,
}: Props) {
  const { t } = useTranslation();

  const { colors } = useTheme();
  const onPress = useCallback(() => {
    invariant(onSelect, "onSelect required");
    return onSelect(deviceMeta);
  }, [deviceMeta, onSelect]);

  const family = deviceMeta.deviceId.split("|")[0];
  const CustomIcon = family && iconByFamily[family];

  const onMore = useMemo(
    () =>
      family !== "usb" && !!onBluetoothDeviceAction
        ? () => onBluetoothDeviceAction(deviceMeta)
        : undefined,
    [family, onBluetoothDeviceAction, deviceMeta],
  );

  return (
    <><Item
      title={deviceMeta.deviceName}
      description={t("PairDevices.alreadyPaired")}
      withArrow={withArrow}
      onPress={onPress}
      event="DeviceItemEnter"
      testID={`DeviceItemEnter ${deviceMeta.deviceName ?? ""}`}
      onMore={onMore}
      disabled={true}
      icon={
        CustomIcon ? (
          <CustomIcon color={colors.darkBlue} />
        ) : (
          <IconNanoX
            color={colors.darkBlue}
            height={36}
            width={8}
            style={disabled ? styles.deviceIconDisabled : undefined}
          />
        )
      }
    />
      <SelectableList.Element onPress={onPress} Icon={NanoFoldedMedium}>
        <Flex><Text>{deviceMeta.deviceName}</Text><Text>{deviceMeta.deviceName}</Text></Flex>

      </SelectableList.Element>
    </>
  );
}

export default memo<Props>(DeviceItem);

const styles = StyleSheet.create({
  specialIcon: {
    position: "absolute",
    left: 4,
  },
  deviceIconDisabled: {
    opacity: 0.4,
  },
});
