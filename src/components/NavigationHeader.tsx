import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { ArrowLeftMedium, CloseMedium } from "@ledgerhq/native-ui/assets/icons";
import { Flex, Text, Link } from "@ledgerhq/native-ui";
import { StackHeaderProps } from "@react-navigation/stack";
import { getHeaderTitle } from "@react-navigation/elements";

// Magic number
const HEADER_HEIGHT = 52;

function NavigationHeader({
  navigation,
  layout,
  route,
  options,
  back,
}: StackHeaderProps) {
  const { t } = useTranslation();
  const title = t(getHeaderTitle(options, route.name));

  return (
    <Flex height={layout.height / 10 + HEADER_HEIGHT} justifyContent="flex-end">
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          navigation.canGoBack() && navigation.goBack();
        }}
      />
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="palette.neutral.c00"
        p={6}
      >
        {back ? (
          <Link
            size="large"
            Icon={ArrowLeftMedium}
            onPress={navigation.goBack}
          />
        ) : (
          <View />
        )}
        <Text variant="large" fontWeight="semiBold">
          {title}
        </Text>
        <Link size="large" Icon={CloseMedium} onPress={navigation.popToTop} />
      </Flex>
    </Flex>
  );
}

export default NavigationHeader;
