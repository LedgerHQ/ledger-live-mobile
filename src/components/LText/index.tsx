/* @flow */
import React from "react";
import { Text } from "@ledgerhq/native-ui";
import getFontStyle from "./getFontStyle";
import { FontWeightTypes } from "@ledgerhq/native-ui/components/Text/getTextStyle";

export { getFontStyle };

export type Opts = {
  bold?: boolean;
  semiBold?: boolean;
  secondary?: boolean;
  monospace?: boolean;
  color?: string;
  bg?: string;
  children?: React.ReactNode;
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

const inferFontWeight = ({ semiBold, bold }: Opts): FontWeightTypes => {
  if (bold) {
    return 'bold'
  } else if (semiBold) {
    return 'semibold'
  }
  return 'medium'
};

/**
 * This component is just a proxy to the Text component defined in @ledgerhq/react-ui.
 * It should only be used to map legacy props/logic from LLM to the new text component.
 *
 * @deprecated Please, prefer using the Text component from our design-system if possible.
 */
export default function LText({ color, children, semiBold, bold, ...props }: Opts) {
  return (
    <Text {...props} fontWeight={inferFontWeight({semiBold, bold})} color={color}>
      {children}
    </Text>
  );
}
