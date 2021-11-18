// @flow
import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  width: number,
  height: number,
  color: string,
};

export default function AccountsIcon({ width = 20, height = 18, color }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M0 12.2838L5.55698 7.00541H13.9821L18.2843 2.94324C18.233 3.55135 18.233 4.13514 18.233 4.71892V6.25135H20L19.9744 0L13.4187 0V1.7027H15.032C15.621 1.7027 16.2612 1.7027 16.8758 1.65405L13.1626 5.18108H4.78873L0 9.70541L0 12.2838ZM0 18H2.1767V15.0324H0L0 18ZM4.45583 18H6.63252V13.1108H4.45583V18ZM8.91165 18H11.0883V9.97297H8.91165V18ZM13.3675 18H15.5442V12.1622H13.3675V18ZM17.7977 18H19.9744V9H17.7977V18Z"
        fill={color}
        fill-opacity="0.5"
      />
    </Svg>
  );
}