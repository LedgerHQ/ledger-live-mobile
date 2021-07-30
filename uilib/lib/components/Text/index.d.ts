import React from "react";
import { TextTypes } from "./getTextStyle";
declare type Props = {
    type: TextTypes;
    fontFamily?: string;
    fontSize?: number | string;
    textAlign?: string;
    color?: string;
    fontWeight?: string;
    mt?: number | string;
    mb?: number | string;
    ml?: number | string;
    mr?: number | string;
    lineHeight?: string;
    bracket?: boolean;
    children: React.ReactNode;
};
declare const Text: ({ children, bracket, color, ...props }: Props) => JSX.Element;
export default Text;
