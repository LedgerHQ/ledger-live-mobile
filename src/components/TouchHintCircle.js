// @flow

import React, { Component } from "react";
import {
  InteractionManager,
  Animated,
  View,
  StyleSheet,
  Easing,
} from "react-native";
import colors from "../colors";

class TouchHintCircle extends Component<*> {
  leftAnimated = new Animated.Value(0);
  opacityAnimated = new Animated.Value(1);

  componentDidMount() {
    Animated.spring(this.opacityAnimated, {
      toValue: 0,
      delay: 200,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(this.leftAnimated, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      {
        delay: 800,
        iterations: 3,
      },
    ).start();

    Animated.spring(this.opacityAnimated, {
      toValue: 0,
      delay: 3000,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const translateX = this.leftAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 80],
    });

    const opacity = this.opacityAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          this.props.style,
          styles.wrap,
          {
            opacity,
            transform: [
              {
                translateX,
              },
            ],
          },
        ]}
      >
        <View style={styles.root}>
          <View style={styles.ball} />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  root: {
    height: 40,
    width: 40,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightLive,
  },
  ball: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: colors.live,
  },
});

export default TouchHintCircle;
