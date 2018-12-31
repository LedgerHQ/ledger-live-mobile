// @flow

import React from "react";
import { Image } from "react-native";

// img dimension 1672*424
// ratio 0,2535

type Props = {
  size?: number,
};

const ThorSwap = ({ size = 160 }: Props) => (
  <Image
    style={{ width: size, height: (size * 424) / 1672 }}
    source={require("../../images/exchanges/thor-swap.png")}
  />
);

export default ThorSwap;
