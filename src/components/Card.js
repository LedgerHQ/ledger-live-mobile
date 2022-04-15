// @flow

import React from "react";
import { RectButton } from "react-native-gesture-handler";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

type Props = {
  onPress?: () => void,
  children: any,
  style?: any,
  bg?: string,
  cardTestId?: string,
};

export default function Card({
  onPress,
  style,
  children,
  bg,
  cardTestId,
}: Props) {
  const { colors } = useTheme();
  const backgroundStyle = { backgroundColor: colors[bg] || colors.card };
  return onPress ? (
    <RectButton
      onPress={onPress}
      style={[styles.root, backgroundStyle, style]}
      testID={cardTestId}
    >
      {children}
    </RectButton>
  ) : (
    <View style={[styles.root, backgroundStyle, style]} testID={cardTestId}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 4,
  },
});
