import React, { useCallback } from "react";
import { Linking, Image, View } from "react-native";
import { Box, Flex, Text } from "@ledgerhq/native-ui";
import getWindowDimensions from "../../logic/getWindowDimensions";
import Touchable from "../Touchable";

type PropType = {
  url: string;
  name: string;
  title: any;
  description: any;
  image: any;
  position: any;
};

const Slide = ({
  url,
  name,
  title,
  description,
  image,
  position,
}: PropType) => {
  const slideWidth = getWindowDimensions().width - 32;
  const onClick = useCallback(() => {
    Linking.openURL(url);
  }, [url]);
  return (
    <Touchable event={`${name} Carousel`} onPress={onClick}>
      <Flex
        position={"relative"}
        width={"248px"}
        height={"182px"}
        borderRadius={2}
        borderWidth={"1px"}
        borderColor={"neutral.c40"}
        justifyContent={"flex-end"}
        p={6}
      >
        <Image style={[{ position: "absolute" }, position]} source={image} />
        <Text variant={"bodyLineHeight"} fontWeight={"medium"}>
          {description}
        </Text>
      </Flex>
    </Touchable>
  );
};

export default Slide;
