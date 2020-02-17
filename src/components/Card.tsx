import React from "react";
import { RectButton } from "react-native-gesture-handler";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

interface Props {
  onPress?: () => void;
  children: any;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, onPress, style }: Props) {
  return onPress ? (
    <RectButton onPress={onPress} style={[styles.root, style]}>
      {children}
    </RectButton>
  ) : (
    <View style={[styles.root, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderRadius: 4,
  },
});
