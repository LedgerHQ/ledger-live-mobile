// @flow

import React from "react";
import { View, StyleSheet } from "react-native";

import { Trans } from "react-i18next";
import Icon from "react-native-vector-icons/dist/Feather";
import Touchable from "../Touchable";
import LText from "../LText";
import Circle from "../Circle";
import { useTheme } from "@react-navigation/native";

type Props = {
  onPress: () => void,
};

export default function PairNewDeviceButton({ onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Touchable event="AddDevice" onPress={onPress}>
      <View style={[styles.root, { borderColor: colors.fog }]}>
        <Circle bg={colors.pillActiveBackground} size={30}>
          <Icon name="plus" size={20} color={colors.pillActiveForeground} />
        </Circle>
        <LText semiBold style={styles.text} color="live">
          <Trans i18nKey="SelectDevice.deviceNotFoundPairNewDevice" />
        </LText>
      </View>
    </Touchable>
  );
}

// Word of caution, to make the + button align we are not following the
// normal 8s sizing for margins. This is microadjusted.
const styles = StyleSheet.create({
  root: {
    height: 64,
    padding: 16,
    paddingLeft: 9,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 4,
    borderWidth: 1,
  },
  text: {
    marginLeft: 15,
    flex: 1,
    fontSize: 16,
  },
});
