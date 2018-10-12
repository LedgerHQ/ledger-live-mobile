// @flow

import React, { PureComponent } from "react";
import { View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import LText from "./LText";
import colors from "../colors";

type Device = *;

type Props = {
  device: Device,
  disabled?: boolean,
  description?: *,
  onSelect?: Device => void,
  selected?: boolean,
};

export default class DeviceItem extends PureComponent<Props> {
  onPress = () => {
    const { device, onSelect } = this.props;
    if (onSelect) onSelect(device);
  };

  render() {
    const { device, disabled, selected, onSelect, description } = this.props;
    // FIXME StyleSheet this properly. split more if necessary
    let res = (
      <View
        style={{
          margin: 5,
          padding: 5,
          opacity: disabled ? 0.4 : 1,
          borderBottomWidth: disabled ? 0 : 1,
          borderBottomColor: colors.grey,
          backgroundColor: !disabled ? colors.white : colors.grey,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <LText>ICON</LText>
          <View
            style={{ flexDirection: "column", alignItems: "center", flex: 1 }}
          >
            <LText bold numberOfLines={1} style={{ fontSize: 14 }}>
              {device.name}
            </LText>
            {description ? (
              typeof description === "string" ? (
                <LText semiBold numberOfLines={1} style={{ fontSize: 14 }}>
                  {description}
                </LText>
              ) : (
                description
              )
            ) : null}
          </View>
          {onSelect ? (
            <View style={{ width: 50 }}>
              {selected ? <LText>✓</LText> : null}
            </View>
          ) : null}
        </View>
      </View>
    );

    if (onSelect) {
      res = <RectButton onPress={this.onPress}>{res}</RectButton>;
    }

    return res;
  }
}
