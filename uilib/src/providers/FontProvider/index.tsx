import React from "react";
import { useFonts } from "expo-font";

export default ({ children }: { children: React.ReactNode }) => {
  const [fontsLoaded] = useFonts({
    Inter: require("../../../assets/fonts/inter/Inter-Regular.woff2"),
    Alpha: require("../../../assets/fonts/alpha/HMAlphaMono-Medium.woff2"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return children;
};
