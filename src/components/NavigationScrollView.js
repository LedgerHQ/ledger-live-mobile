// @flow

import React, { useEffect, useRef } from "react";
import { ScrollView, StyleProp } from "react-native";
import { useIsFocused, useScrollToTop } from "@react-navigation/native";
import { headerPressSubject } from "../navigation/observable";

interface Props {
  children: React$Element;
  style: StyleProp<ScrollView>;
}

export default function NavigationScrollView({ children, style }: Props) {
  const isFocused = useIsFocused();
  const ref = useRef();
  useScrollToTop(ref);

  useEffect(() => {
    const subscription = headerPressSubject.subscribe(() => {
      if (!ref.current || !isFocused) {
        return;
      }

      ref.current.scrollTo();
    });

    return () => subscription.unsubscribe();
  }, [isFocused]);

  return (
    <ScrollView ref={ref} style={style}>
      {children}
    </ScrollView>
  );
}
