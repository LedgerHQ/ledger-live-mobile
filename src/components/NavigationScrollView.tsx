import React, { useRef } from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import styled from "styled-components/native";
import { useScrollToTop } from "../navigation/utils";

const StyledScrollView = styled(ScrollView)`
  background-color: ${p => p.theme.colors.palette.background.main};
`;

export default function NavigationScrollView({
  children,
  ...scrollViewProps
}: ScrollViewProps) {
  const ref = useRef();
  useScrollToTop(ref);

  return (
    <StyledScrollView ref={ref} {...scrollViewProps}>
      {children}
    </StyledScrollView>
  );
}
