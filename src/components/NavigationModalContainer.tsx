import { Flex } from "@ledgerhq/native-ui";
import styled from "styled-components/native";

export default styled(Flex).attrs(p => ({
  flex: 1,
  backgroundColor: "palette.neutral.c00",
  p: p.p ?? 6,
  mb: p.mb ?? 4,
}))``;
