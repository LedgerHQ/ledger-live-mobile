// @flow
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import colors from "../colors";
import LText from "./LText";

type Props = {
  name: string,
  icon?: React$Node,
  onPress?: () => void,
};

export default function AccountSectionLabel({ name, icon, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <LText semiBold style={styles.label}>
        {name}
      </LText>
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    fontSize: 18,
    color: colors.darkBlue,
    marginRight: 6,
  },
});
