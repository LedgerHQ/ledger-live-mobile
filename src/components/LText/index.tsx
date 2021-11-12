/* @flow */
import React from "react";
import { Text } from "@ledgerhq/native-ui";
import getFontStyle from "./getFontStyle";

export { getFontStyle };

export type Opts = {
  bold?: boolean;
  semiBold?: boolean;
  secondary?: boolean;
  monospace?: boolean;
  color?: string;
  bg?: string;
};

export type Res = {
  fontFamily: string;
  fontWeight:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
};

export default function LText({ color, children, ...props }: any) {
  return (
    <Text {...props} color={color}>
      {children}
    </Text>
  );
}
