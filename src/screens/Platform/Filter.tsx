import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Flex, Text } from "@ledgerhq/native-ui";
import styled from "styled-components/native";

const OptionContainer = styled(Flex).attrs({})<{ isLast?: boolean }>`
  height: 32px;
  border-radius: 16px;
  ${p => !p.isLast && "margin-right: 12px"};
  background-color: ${p =>
    p.enabled ? p.theme.colors.primary.c80 : p.theme.colors.neutral.c30};
  padding-horizontal: 12px;
  padding-vertical: 7.5px;
  align-items: center;
`.withComponent(TouchableOpacity);

const OptionLabel = styled(Text).attrs(p => ({
  color: p.enabled ? "neutral.c00" : "neutral.c100",
  variant: "body",
  fontWeight: "semiBold",
  fontSize: "14px",
  lineHeight: 16.94,
}))``;

type Option = {
  value: string;
  label: string;
  enabled: boolean;
  onPress: () => void;
};

type Props = {
  options: Option[];
};

const Filter = ({ options }: Props) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {options.map((option, index, arr) => (
      <OptionContainer
        enabled={option.enabled}
        onPress={() => option.onPress()}
        isLast={index === arr.length - 1}
      >
        <OptionLabel enabled={option.enabled}>{option.label}</OptionLabel>
      </OptionContainer>
    ))}
  </ScrollView>
);

export default Filter;
