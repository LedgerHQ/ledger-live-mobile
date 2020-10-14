// @flow
import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

type Props = {
  size: number,
  color: string,
};

export default function Lending({ size = 16, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 17">
      <Path
        d="M2.54541 7.27274V11.0909C2.54541 12.1955 3.44084 13.0909 4.54541 13.0909H9.4545"
        stroke={color}
        stroke-width="1.5"
      />
      <Path
        d="M7.27263 10.5455L9.45445 13.0909L7.27263 15.6364"
        stroke={color}
        stroke-width="1.5"
      />
      <Path
        d="M13.4546 9.09091V5.27273C13.4546 4.16816 12.5592 3.27273 11.4546 3.27273H6.90914"
        stroke={color}
        stroke-width="1.5"
      />
      <Path
        d="M9.0909 5.81819L6.90908 3.27274L9.0909 0.727281"
        stroke={color}
        stroke-width="1.5"
      />
      <Rect
        x="11.6591"
        y="10.9318"
        width="3.59091"
        height="3.59091"
        rx="1.79545"
        stroke={color}
        stroke-width="1.5"
      />
      <Rect
        x="0.75"
        y="1.47726"
        width="3.59091"
        height="3.59091"
        rx="1.79545"
        stroke={color}
        stroke-width="1.5"
      />
    </Svg>
  );
}
