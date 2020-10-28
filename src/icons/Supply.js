// @flow
import React from "react";
import Svg, { Path, G } from "react-native-svg";

type Props = {
  size: number,
  color: string,
};

export default function TransferIcon({ size = 16, color }: Props) {
  return (
    <Svg viewBox="0 0 12 8" width={size} height={size}>
      <Path
        fill={color}
        d="M7.75651 0.786458L7.26172 1.28125C7.16276 1.40495 7.16276 1.57812 7.28646 1.70182L9.26562 3.60677H0.755208C0.582031 3.60677 0.458333 3.75521 0.458333 3.90365V4.59635C0.458333 4.76953 0.582031 4.89323 0.755208 4.89323H9.26562L7.28646 6.82292C7.16276 6.94661 7.16276 7.11979 7.26172 7.24349L7.75651 7.73828C7.88021 7.83724 8.05339 7.83724 8.17708 7.73828L11.4427 4.47266C11.5417 4.34896 11.5417 4.17578 11.4427 4.05208L8.17708 0.786458C8.05339 0.6875 7.88021 0.6875 7.75651 0.786458Z"
      />
    </Svg>
  );
}
