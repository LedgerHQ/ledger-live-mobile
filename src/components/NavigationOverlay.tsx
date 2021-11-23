import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { rgba } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";

export default function NavigationOverlay() {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <Pressable
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: rgba(theme.colors.palette.neutral.c100, 0.5) },
      ]}
      onPress={() => {
        navigation.canGoBack() && navigation.goBack();
      }}
    />
  );
}
