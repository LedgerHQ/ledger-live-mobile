// @flow
import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number,
  stroke: string | null,
  fill: string | null,
};
export default function Star({ size = 18, stroke, fill }: Props) {
  return (
    <Svg viewBox="0 0 18 18" height={size} width={size}>
      <Path
        fill={fill}
        stroke={stroke}
        d="M10.5317 7.05077L10.7001 7.56901H11.245H16.2021L12.1917 10.4828L11.7509 10.803L11.9192 11.3213L13.4511 16.0358L9.44066 13.1221L8.99982 12.8018L8.55898 13.1221L4.54855 16.0358L6.0804 11.3213L6.24879 10.803L5.80795 10.4828L1.79752 7.56901H6.75468H7.29959L7.46797 7.05077L8.99982 2.33623L10.5317 7.05077ZM13.784 17.0603C13.7839 17.0601 13.7838 17.0599 13.7837 17.0596L13.784 17.0603Z"
      />
    </Svg>
  );
}
