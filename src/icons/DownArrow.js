// @flow
import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  width: number,
  height: number,
  color: string,
};

export default function DownArrow({ width = 10, height = 6, color }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.36377 1.18164L5.00013 4.818L8.6365 1.18164"
        stroke={color}
        stroke-width="1.5"
      />
    </Svg>
  );
}
