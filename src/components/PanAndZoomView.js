// @flow

import React, { useRef } from "react";

import {
  PinchGestureHandler,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { Animated } from "react-native";


const PanAndZoomView = ({ children }) => {
  const animatedScale = useRef(new Animated.Value(1)).current;
  const previousScaleOffset = useRef(1);
  const currentScaleOffset = useRef(new Animated.Value(1)).current;
  const handlePinch = Animated.event([{ nativeEvent: { scale: animatedScale } }], {
        useNativeDriver: true,
      });
  const scale = Animated.multiply(animatedScale, currentScaleOffset);

  const previousTranslateXOffset = useRef(0);
  const currentTranslateXOffset = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const previousTranslateYOffset = useRef(0);
  const currentTranslateYOffset = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePan = Animated.event(
        [
          {
            nativeEvent: { translationX: translateX, translationY: translateY },
          },
        ],
        {
          useNativeDriver: true,
        },
      );

  return (
    <PinchGestureHandler
      onGestureEvent={handlePinch}
      minPointers={2}
      maxPointers={2}
      onHandlerStateChange={e => {
        if (e.nativeEvent.state === State.END) {
          // this is to prevent the image from jumping back to the original size
          previousScaleOffset.current *= e.nativeEvent.scale;
          animatedScale.setValue(1);
          currentScaleOffset.setValue(previousScaleOffset.current);
        }
      }}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale }],
          },
        ]}
      >
        <PanGestureHandler
          onGestureEvent={handlePan}
          minPointers={1}
          maxPointers={1}
          onHandlerStateChange={e => {
            console.log(e.nativeEvent);
            console.log("Before", previousTranslateXOffset.current);
            if (e.nativeEvent.state === State.END) {
              previousTranslateXOffset.current += e.nativeEvent.translationX / previousScaleOffset.current;
              currentTranslateXOffset.setValue(
                previousTranslateXOffset.current,
              );
              translateX.setValue(0);

              previousTranslateYOffset.current += e.nativeEvent.translationY / previousScaleOffset.current;
              currentTranslateYOffset.setValue(
                previousTranslateYOffset.current,
              );
              translateY.setValue(0);
            }
            console.log("After", {
              previousTranslateXOffset: previousTranslateXOffset.current,
              currentTranslateXOffset,
            });
          }}
        >
          <Animated.View
            style={
              [{
                transform: [
                  {
                    translateX: Animated.add(
                      currentTranslateXOffset,
                      Animated.divide(translateX, scale),
                    ),
                  },
                  {
                    translateY: Animated.add(
                      currentTranslateYOffset,
                      Animated.divide(translateY, scale),
                    ),
                  },
                ],
              },
            ]}
          >
              {children}            
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default PanAndZoomView;
