import React, { useCallback } from "react";
import { Linking, Image } from "react-native";
import { Flex, Text } from "@ledgerhq/native-ui";
import Touchable from "../Touchable";
import { track } from "../../analytics";

type SlideProps = {
  url: string;
  name: string;
  title: any;
  description: any;
  image: any;
  icon: any;
  position: any;
};

const Slide = ({
  url,
  name,
  description,
  image,
  icon,
  position,
}: SlideProps) => {
  const onClick = useCallback(() => {
    track("Portfolio Recommended OpenUrl", {
      url,
    });
    Linking.openURL(url);
  }, [url]);
  return (
    <Touchable event={`${name} Carousel`} onPress={onClick}>
      <Flex
        width={"248px"}
        height={"182px"}
        borderRadius={2}
        borderWidth={"1px"}
        borderColor={"neutral.c40"}
        justifyContent={"space-between"}
        p={6}
      >
        {image ? (
          <Image style={[{ position: "absolute" }, position]} source={image} />
        ) : icon ? (
          <Flex>{icon}</Flex>
        ) : null}
        <Text variant={"bodyLineHeight"} fontWeight={"medium"}>
          {description}
        </Text>
      </Flex>
    </Touchable>
  );
};

export default Slide;
