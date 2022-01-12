import React from "react";
import { Pressable, SafeAreaView } from "react-native";
import { Flex } from "@ledgerhq/native-ui";
import { StackScreenProps } from "@react-navigation/stack";
import styled from "styled-components/native";
import type { FlexBoxProps } from "@ledgerhq/native-ui/components/layout/Flex";

export const MIN_MODAL_HEIGHT = 30;

const ScreenContainer = styled(Flex).attrs(p => ({
  edges: ["bottom"],
  flex: 1,
  p: p.p ?? 6,
}))``;
type Props = StackScreenProps<{}> & { 
  children: React.ReactNode, 
  contentContainerProps?: FlexBoxProps,
  deadZoneProps?: FlexBoxProps,
 };

export default function NavigationModalContainer({
  navigation,
  children,
  contentContainerProps,
  deadZoneProps,
}: Props) {
  return (
    <Flex flex={1}>
      <Flex height="8%" minHeight={MIN_MODAL_HEIGHT} {...deadZoneProps}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            navigation.canGoBack() && navigation.goBack();
          }}
        />
      </Flex>

      <ScreenContainer backgroundColor="palette.neutral.c00" {...contentContainerProps}>
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </ScreenContainer>
    </Flex>
  );
}
