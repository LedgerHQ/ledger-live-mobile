import React from "react";

import { Flex } from "@ledgerhq/native-ui";
import Animation from "../../../components/Animation";

export default function LottieIllustration({
  lottie,
  style,
}: {
  lottie: any;
  style: any;
}) {
  return (
    <Flex
      flex={1}
      alignItems="flex-end"
      justifyContent="flex-end"
      left={"15%"}
      width={"115%"}
    >
      <Animation
        source={lottie}
        style={[{ width: "100%", height: 150 }, style]}
      />
    </Flex>
  );
}
