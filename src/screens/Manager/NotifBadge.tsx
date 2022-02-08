import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "styled-components/native";
import styled from "styled-components/native";
import { Flex } from "@ledgerhq/native-ui";

const Badge = styled(Flex).attrs({
  position: "absolute",
  top: -5,
  right: -4,
  width: 14,
  height: 14,
  borderRadius: 7,
  borderWidth: 3,
})``;

export default () => {
  const { colors } = useTheme();
  return (
    <Badge
      style={{
        backgroundColor: colors.constant.purple,
        borderColor: colors.background.main,
      }}
    />
  );
};
