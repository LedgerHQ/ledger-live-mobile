// @flow
import React, { useState, useCallback } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import AnimatedSplash from "react-native-animated-splash-screen";
import * as Animatable from "react-native-animatable";

import AnimatedLottieView from "lottie-react-native";

import { normalize } from "../helpers/normalizeSize";

const splashAnim = require("../animations/splash.json");

export default function SplashScreenLoader({
  children,
}: {
  children: React$Node,
}) {
  const [progress] = useState(new Animated.Value(0));
  const [mounted, setMounted] = useState(false);

  const startLottie = useCallback(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => setMounted(true));
  }, [progress]);

  return (
    <AnimatedSplash
      translucent
      isLoaded={mounted}
      customComponent={
        <Animatable.View
          animation="fadeIn"
          delay={1000}
          duration={500}
          style={styles.root}
          onAnimationEnd={startLottie}
        >
          <AnimatedLottieView
            source={splashAnim}
            progress={progress}
            resizeMode="cover"
            onAnimationFinish={() => setMounted(true)}
            style={styles.lottie}
          />
        </Animatable.View>
      }
      backgroundColor={"#000000"}
    >
      {children}
    </AnimatedSplash>
  );
}

const styles = StyleSheet.create({
  root: { height: 48, width: 233 },
  lottie: {
    backgroundColor: "rgba(0,0,0,0)",
  },
});
