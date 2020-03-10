// @flow

import React, { useRef } from "react";
import { ScrollView, StyleProp } from "react-native";
import { useScrollToTop } from "../navigation/utils";

interface Props {
  children: any;
  style: StyleProp<ScrollView>;
}

export default function NavigationScrollView({ children, style }: Props) {
  const ref = useRef();
  useScrollToTop(ref);

  return (
    <ScrollView ref={ref} style={style}>
      {children}
    </ScrollView>
  );
}
