// @flow

// img dimension 800*328
// ratio 0.41

import React from "react";
import { Image } from "react-native";

type Props = {
  size?: number,
};

const KyberSwap = ({ size = 160 }: Props) => (
  <Image
    style={{ width: size, height: (size * 65.6) / 160 }}
    source={require("../../images/exchanges/kyber-swap.png")}
  />
);

export default KyberSwap;
