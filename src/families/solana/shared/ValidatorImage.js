// @flow

import React from "react";
import { Image } from "react-native";
import type { ValidatorsAppValidator } from "@ledgerhq/live-common/lib/families/solana/validator-app";
import Circle from "../../../components/Circle";

type Props = {
  size?: number,
  imgUrl?: string,
};

const ValidatorImage = ({ imgUrl, size = 64 }: Props) => {
  return (
    <Circle crop size={size}>
      <Image
        style={{ width: size, height: size }}
        source={imgUrl ? { uri: imgUrl } : require("../../tezos/custom.png")}
      />
    </Circle>
  );
};

export default ValidatorImage;
