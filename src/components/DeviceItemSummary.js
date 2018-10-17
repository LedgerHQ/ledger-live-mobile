// @flow

import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import Touchable from "./Touchable";
import LText from "./LText";
import colors from "../colors";
import IconNanoX from "../icons/NanoX";

type Props = {
  name: string,
  genuine: boolean,
  onEdit: () => *,
};

export default class DeviceItemSummary extends PureComponent<Props> {
  render() {
    const { name, genuine, onEdit } = this.props;
    return (
      <View style={styles.root}>
        <IconNanoX color={colors.darkBlue} height={36} width={8} />
        <View style={styles.content}>
          <LText bold numberOfLines={1} style={styles.deviceNameText}>
            {name}
          </LText>
          {genuine ? (
            <LText numberOfLines={1} style={styles.genuineText}>
              {"Device is genuine"}
            </LText>
          ) : null}
        </View>
        <Touchable onPress={onEdit}>
          <LText bold numberOfLines={1} style={styles.editText}>
            Edit
          </LText>
        </Touchable>
      </View>
    );
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
  content: {
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
    marginLeft: 24,
  },
  deviceNameText: {
    fontSize: 14,
    color: colors.darkBlue,
  },
  genuineText: {
    fontSize: 12,
    color: colors.grey,
  },
  editText: {
    color: colors.live,
    textDecorationLine: "underline",
  },
});
