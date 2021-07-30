import React from "react";
import styled, { useTheme } from "styled-components/native";
import { fontSize, fontWeight, textAlign, color, space, lineHeight, letterSpacing, } from "styled-system";
import BracketRight from "@ui/icons/BracketLeft";
import BracketLeft from "@ui/icons/BracketRight";
import { getColor } from "@ui/styles";
import getTextStyle from "./getTextStyle";
const Base = styled.Text `
  ${lineHeight};
  ${fontSize};
  ${textAlign};
  ${color};
  ${fontWeight};
  ${space};
  ${letterSpacing};
  ${p => getTextStyle(p)}
  justify-content: center;
  align-items: center;
`;
const T = styled.View `
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const BracketText = ({ children, color = "palette.text.default", ...props }) => {
    const { lineHeight: size } = getTextStyle(props);
    const theme = useTheme();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const c = theme ? getColor(theme, color) : "transparent";
    return (React.createElement(T, null,
        React.createElement(BracketLeft, { fill: c, width: size, height: size }),
        React.createElement(Base, { ...props, color: color, bracket: true }, children),
        React.createElement(BracketRight, { fill: c, width: size, height: size })));
};
const Text = ({ children, bracket, color = "palette.text.default", ...props }) => {
    if (bracket)
        return (React.createElement(BracketText, { ...props, color: color }, children));
    return (React.createElement(Base, { ...props, color: color }, children));
};
export default Text;
