import React from "react";
import { TouchableOpacityProps } from "react-native";
import { Flex, Text } from "@ledgerhq/native-ui";
import Touchable from "./Touchable";

const Card = ({
  title,
  titleProps,
  subTitle,
  subTitleProps,
  labelBadge,
  onPress,
  Image,
  ...props
}: {
  title: string;
  titleProps?: any;
  subTitle?: string;
  subTitleProps?: any;
  topLabel?: string;
  labelBadge?: string;
  Image: React.ReactNode;
  onPress: TouchableOpacityProps["onPress"];
}) => (
  <Touchable onPress={onPress} {...props}>
    <Flex
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      borderWidth={"1px"}
      borderColor={"neutral.c40"}
      borderRadius={2}
      mb={6}
      minHeight={112}
    >
      <Flex
        py={7}
        pl={7}
        flex={1}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {labelBadge && (
          <Text
            variant="small"
            px={3}
            py={1}
            mb={2}
            borderRadius={1}
            bg="primary.c80"
          >
            {labelBadge}
          </Text>
        )}
        <Text
          variant={"large"}
          fontWeight={"semiBold"}
          color={"neutral.c100"}
          {...titleProps}
        >
          {title}
        </Text>
        {subTitle && (
          <Text
            variant={"body"}
            fontWeight={"medium"}
            color={"neutral.c70"}
            {...subTitleProps}
          >
            {subTitle}
          </Text>
        )}
      </Flex>
      <Flex
        flex={0.5}
        pl={3}
        pr={6}
        justifyContent="center"
        alignItems="flex-end"
      >
        {Image}
      </Flex>
    </Flex>
  </Touchable>
);

export default Card;
