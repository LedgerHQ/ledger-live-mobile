import React from "react";

import { Flex } from "@ledgerhq/native-ui";
import Animation from "../../../components/Animation";

export default function LottieIllustration({
  lottie,
  style,
}: {
  lottie: any;
  style?: any;
}) {
  return (
    <Flex alignItems="center" width="100%">
      <Animation source={lottie} style={[{ width: "110%" }, style]} />
    </Flex>
  );
}
