// @flow
import React from "react";
import Lottie from "lottie-react-native";
import Config from "react-native-config";
import type { ViewStyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";

type LottieProps = $PropertyType<Lottie, "props">;

export default function Animation({
  style,
  ...lottieProps
}: {
  ...LottieProps,
  style: ViewStyleProp,
}) {
  return (
    <Lottie
      {...lottieProps}
      style={style}
      loop={lottieProps.loop ?? true}
      autoPlay={Config.MOCK ? false : lottieProps.autoplay ?? true}
    />
  );
}
