import React from "react";
import styled from "styled-components/native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { GRADIENT_HEIGHT } from "./shared";

const StyledSVG = styled(Svg)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${GRADIENT_HEIGHT}px;
`;

const BackgroundGradient = ({ colors }: any) => {
  const color = colors.type === "light" ? "white" : "black";
  return (
    <StyledSVG>
      <Defs>
        <LinearGradient
          id="myGradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopOpacity={0} stopColor={color} />
          <Stop offset="100%" stopOpacity={1} stopColor={color} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#myGradient)" />
    </StyledSVG>
  );
};

export default BackgroundGradient;
