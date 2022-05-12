import React from "react";
import styled from "styled-components/native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";

const StyledSVG = styled(Svg)`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

type StopType = {
  stopOpacity: number;
  stopColor: string;
};

type Props = {
  height: number;
  opacity: number;
  stop0: StopType;
  stop100: StopType;
};

const BackgroundGradient = ({ height, opacity, stop0, stop100 }: Props) => (
  <StyledSVG style={{ height }}>
    <Defs>
      <LinearGradient
        id="myGradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0" {...stop0} />
        <Stop offset="100%" {...stop100} />
      </LinearGradient>
    </Defs>
    <Rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      opacity={opacity}
      fill="url(#myGradient)"
    />
  </StyledSVG>
);

export default BackgroundGradient;
