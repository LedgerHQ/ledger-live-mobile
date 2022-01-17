import React from "react";
import { Text, Flex } from "@ledgerhq/native-ui";
import styled from "styled-components/native";

const HeaderText = styled(Text).attrs({
  variant: "h3",
  fontSize: "20px",
  lineHeight: 23,
})``;

const Container = styled(Flex).attrs({
  marginBottom: "24px",
})``;

type Props = {
  title: string;
};

const SectionHeader = ({ title }: Props) => (
  <Container>
    <HeaderText>{title}</HeaderText>
  </Container>
);

export default SectionHeader;
