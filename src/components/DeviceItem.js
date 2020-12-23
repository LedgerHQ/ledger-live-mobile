// @flow

import React, { useCallback } from "react";
import invariant from "invariant";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import Touchable from "./Touchable";
import LText from "./LText";
import colors from "../colors";
import IconNanoX from "../icons/NanoX";
import IconArrowRight from "../icons/ArrowRight";
import USB from "../icons/USB";
import Ellipsis from "../icons/Ellipsis";

type Props = {
  deviceMeta: Device,
  disabled?: boolean,
  withArrow?: boolean,
  description?: React$Node,
  onSelect?: Device => any,
  onBluetoothDeviceAction?: Device => any,
};

const iconByFamily = {
  httpdebug: () => (
    <Icon
      style={styles.specialIcon}
      name="terminal"
      size={16}
      color={colors.darkBlue}
    />
  ),
  usb: () => <USB color={colors.darkBlue} />,
};

export default function DeviceItem({
  deviceMeta,
  onSelect,
  disabled,
  description,
  withArrow,
  onBluetoothDeviceAction,
}: Props) {
  const onPress = useCallback(() => {
    invariant(onSelect, "onSelect required");
    return onSelect(deviceMeta);
  }, [deviceMeta, onSelect]);

  const family = deviceMeta.deviceId.split("|")[0];
  const CustomIcon = family && iconByFamily[family];

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Touchable
          event="DeviceItemEnter"
          onPress={disabled ? undefined : onPress}
        >
          <View
            style={[
              styles.root,
              { backgroundColor: colors.white },
              disabled && styles.rootDisabled,
            ]}
          >
            <View style={styles.iconWrapper}>
              {CustomIcon ? (
                <CustomIcon />
              ) : (
                <IconNanoX
                  color={colors.darkBlue}
                  height={36}
                  width={8}
                  style={disabled ? styles.deviceIconDisabled : undefined}
                />
              )}
            </View>
            <View style={styles.content}>
              <LText
                bold
                numberOfLines={1}
                style={[
                  styles.deviceNameText,
                  disabled && styles.deviceNameTextDisabled,
                ]}
              >
                {deviceMeta.deviceName}
              </LText>
              {description ? (
                <LText
                  numberOfLines={1}
                  style={[
                    styles.descriptionText,
                    disabled && styles.descriptionTextDisabled,
                  ]}
                >
                  {description}
                </LText>
              ) : null}
            </View>
            {!withArrow && family !== "usb" && !!onBluetoothDeviceAction && (
              <Touchable
                event="DeviceItemForget"
                onPress={() => onBluetoothDeviceAction(deviceMeta)}
              >
                <Ellipsis />
              </Touchable>
            )}
            {withArrow && !disabled ? (
              <IconArrowRight size={16} color={colors.grey} />
            ) : null}
          </View>
        </Touchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 15,
  },
  inner: {
    flex: 1,
  },
  forget: {
    paddingRight: 16,
  },
  root: {
    height: 64,
    padding: 16,
    borderColor: colors.fog,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  rootDisabled: {
    borderWidth: 0,
    backgroundColor: colors.lightGrey,
  },
  specialIcon: {
    position: "absolute",
    left: 4,
  },
  content: {
    flexDirection: "column",
    justifyContent: "center",
    flexBasis: "auto",
    flexShrink: 1,
    flexGrow: 1,
    marginLeft: 24,
  },
  deviceIconDisabled: {
    opacity: 0.4,
  },
  deviceNameText: {
    fontSize: 16,
    color: colors.darkBlue,
  },
  deviceNameTextDisabled: {
    color: colors.grey,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.darkBlue,
  },
  descriptionTextDisabled: {
    color: colors.grey,
  },
  selectedIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: 50,
    backgroundColor: colors.live,
  },
  selectIconPlaceHolder: {
    width: 24,
    height: 24,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.fog,
  },
});
