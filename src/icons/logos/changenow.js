// @flow

import React from "react";
import { Image } from "react-native";

// img dimension 450*280
// ratio 0.62222

type Props = {
  size?: number,
};

const ChangeNow = ({ size = 160 }: Props) => (
  <Image
    resizeMode="contain"
    style={{ width: size, height: (size * 280) / 450 }}
    source={require("../../images/exchanges/ChangeNOW.png")}
  />
);

export default ChangeNow;
