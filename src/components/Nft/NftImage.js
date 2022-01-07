// @flow

import React, { useCallback, useRef, useState } from "react";

import FastImage from "react-native-fast-image";
import {
  PinchGestureHandler,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { Image, View, StyleSheet, Animated, Platform } from "react-native";
import ImageNotFoundIcon from "../../icons/ImageNotFound";
import Skeleton from "../Skeleton";

const ImageComponent = ({
  style,
  source,
  resizeMode,
  onLoadEnd,
  onLoad,
}: {
  style: Object,
  source: { [string]: string },
  resizeMode: string,
  onLoadEnd: () => *,
  onLoad: () => *,
}) =>
  Platform.OS === "android" ? (
    <Image
      style={style}
      resizeMode={resizeMode}
      source={source}
      onLoad={onLoad}
      onLoadEnd={onLoadEnd}
    />
  ) : (
    <FastImage
      style={style}
      resizeMode={FastImage.resizeMode[resizeMode]}
      source={source}
      onLoad={onLoad}
      onLoadEnd={onLoadEnd}
    />
  );

const NotFound = ({
  colors,
  onLayout,
}: {
  colors: Object,
  onLayout: () => *,
}) => {
  const [iconWidth, setIconWidth] = useState(40);

  return (
    <View
      style={[
        styles.notFoundView,
        {
          backgroundColor: colors.skeletonBg,
        },
      ]}
      onLayout={e => {
        setIconWidth(Math.min(e.nativeEvent.layout.width * 0.4, 40));
        onLayout?.();
      }}
    >
      <ImageNotFoundIcon width={iconWidth} height={iconWidth} />
    </View>
  );
};

type Props = {
  style?: Object,
  status: string,
  src: string,
  zoomable?: boolean,
  hackWidth?: number,
};

const NftImage = ({ src, status, style, zoomable, hackWidth = 90 }: Props) => {
  const { colors } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [loadError, setLoadError] = useState(null);

  const startAnimation = useCallback(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const hackSrc = (() => {
    const isPreProcessedSrc = /^https:\/\/lh3.googleusercontent.com\/.*/g;
    return isPreProcessedSrc.test(src) ? `${src}=s${hackWidth}` : src;
  })();

  const animatedScale = useRef(new Animated.Value(1)).current;
  const previousScaleOffset = useRef(1);
  const currentScaleOffset = useRef(new Animated.Value(1)).current;
  const handlePinch = zoomable
    ? Animated.event([{ nativeEvent: { scale: animatedScale } }], {
        useNativeDriver: true,
      })
    : null;
  const scale = Animated.multiply(animatedScale, currentScaleOffset);

  const previousTranslateXOffset = useRef(0);
  const currentTranslateXOffset = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const previousTranslateYOffset = useRef(0);
  const currentTranslateYOffset = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePan = zoomable
    ? Animated.event(
        [
          {
            nativeEvent: { translationX: translateX, translationY: translateY },
          },
        ],
        {
          useNativeDriver: true,
        },
      )
    : null;

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
            style={[
              style,
              styles.root,
              {
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
            <Skeleton style={styles.skeleton} loading={true} />
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  opacity: opacityAnim,
                },
              ]}
            >
              {status === "nodata" ||
              status === "error" ||
              (status === "loaded" && !src) ||
              loadError ? (
                <NotFound colors={colors} onLayout={startAnimation} />
              ) : (
                <ImageComponent
                  style={[
                    styles.image,
                    {
                      backgroundColor: colors.white,
                    },
                  ]}
                  resizeMode="cover"
                  source={{
                    uri: hackSrc,
                  }}
                  onLoad={({ nativeEvent }: Image.ImageLoadEvent) => {
                    if (!nativeEvent) {
                      setLoadError(true);
                    }
                  }}
                  onLoadEnd={startAnimation}
                  onError={() => setLoadError(true)}
                />
              )}
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "relative",
  },
  skeleton: {
    position: "absolute",
    zIndex: -1,
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    zIndex: 1,
    flex: 1,
  },
  image: {
    flex: 1,
  },
  notFoundView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NftImage;
