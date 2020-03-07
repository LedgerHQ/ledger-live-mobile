// @flow

import React, { useEffect, useRef } from "react";
import { ScrollView, StyleProp } from "react-native";
import { headerPressSubject } from "../navigation/observable";

interface Props {
  children: React.ReactNode;
  style: StyleProp<ScrollView>;
}

export default function NavigationScrollView({ children, style }: Props) {
  const ref = useRef();

  useEffect(() => {
    const subscription = headerPressSubject.subscribe(() => {
      if (!ref.current) {
        return;
      }

      ref.current.scrollTo();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ScrollView ref={ref} style={style}>
      {children}
    </ScrollView>
  );
}
