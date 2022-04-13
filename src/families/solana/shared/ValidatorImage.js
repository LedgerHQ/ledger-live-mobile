// @flow

import React from "react";
import { Image } from "react-native";
import type { ValidatorsAppValidator } from "@ledgerhq/live-common/lib/families/solana/validator-app";
import Circle from "../../../components/Circle";

type Props = {
  size?: number,
  validator?: ?ValidatorsAppValidator,
};

const ValidatorImage = ({ validator, size = 64 }: Props) => (
  <Circle crop size={size}>
    <Image
      style={{ width: size, height: size }}
      source={
        validator && validator.avatarUrl
          ? { uri: validator.avatarUrl }
          : require("../../tezos/custom.png")
      }
    />
  </Circle>
);

export default ValidatorImage;
