// @flow

import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import { RectButton } from "react-native-gesture-handler";
import LText from "./LText";
import colors from "../colors";
import IconNanoX from "../icons/NanoX";
import IconArrowRight from "../icons/ArrowRight";

export type Device = {
  id: string,
  name: string,
};

type Props<T> = {
  device: T,
  name: string,
  family?: ?string,
  disabled?: boolean,
  description?: string,
  onSelect?: T => any,
};

const iconByFamily = {
  ble: "bluetooth",
  usb: "usb",
  httpdebug: "terminal",
};

export default class DeviceItem<T> extends PureComponent<Props<T>> {
  onPress = () => {
    const { device, onSelect } = this.props;
    if (onSelect) onSelect(device);
  };

  render() {
    const { name, family, disabled, onSelect, description } = this.props;

    let res = (
      <View style={[styles.root, disabled && styles.rootDisabled]}>
        {!family ? (
          <IconNanoX
            color={colors.darkBlue}
            height={36}
            width={8}
            style={disabled ? styles.deviceIconDisabled : undefined}
          />
        ) : (
          <Icon name={iconByFamily[family]} size={32} color={colors.darkBlue} />
        )}
        <View style={styles.content}>
          <LText
            bold
            numberOfLines={1}
            style={[
              styles.deviceNameText,
              disabled && styles.deviceNameTextDisabled,
            ]}
          >
            {name}
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
        {!disabled && <IconArrowRight size={16} color={colors.grey} />}
      </View>
    );

    if (onSelect && !disabled) {
      res = <RectButton onPress={this.onPress}>{res}</RectButton>;
    }

    return <View style={styles.outer}>{res}</View>;
  }
}

const styles = StyleSheet.create({
  outer: {
    marginBottom: 16,
  },
  root: {
    paddingVertical: 14,
    paddingHorizontal: 24,
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
  content: {
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
    marginLeft: 24,
  },
  deviceIconDisabled: {
    opacity: 0.4,
  },
  deviceNameText: {
    fontSize: 14,
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
});
