import React from "react";
import { Pressable, SafeAreaView } from "react-native";
import { Flex } from "@ledgerhq/native-ui";
import { StackScreenProps } from "@react-navigation/stack";
import styled from "styled-components/native";

export const MIN_MODAL_HEIGHT = 30;

const ScreenContainer = styled(Flex).attrs(p => ({
  edges: ["bottom"],
  flex: 1,
  backgroundColor: "palette.neutral.c00",
  p: p.p ?? 6,
}))``;
type Props = StackScreenProps<{}> & { children: React.ReactNode };

export default function NavigationModalContainer({
  navigation,
  children,
}: Props) {
  return (
    <Flex flex={1}>
      <Flex height="8%" minHeight={MIN_MODAL_HEIGHT}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            navigation.canGoBack() && navigation.goBack();
          }}
        />
      </Flex>

      <ScreenContainer>
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </ScreenContainer>
    </Flex>
  );
}
