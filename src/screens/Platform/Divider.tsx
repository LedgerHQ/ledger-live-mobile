import {Flex} from "@ledgerhq/native-ui";
import styled from "styled-components/native";

const Divider = styled(Flex).attrs({
  width: "100%",
  height: "1px",
  backgroundColor: "neutral.c40",
  marginVertical: 24,
})``;

export default Divider;