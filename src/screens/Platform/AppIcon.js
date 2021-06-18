// @flow
import React, { memo, useState, useCallback } from "react";
import { Image, View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

import LText from "../../components/LText";

type Props = {
  name?: string,
  icon?: string,
  size: number,
};

function AppIcon({ size = 48, name, icon }: Props) {
  const { colors } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderColor: colors.fog,
          backgroundColor: colors.card,
        },
      ]}
    >
      {!imageLoaded && (
        <LText style={{ fontSize: size / 2 }} semiBold>
          {name[0].toUpperCase()}
        </LText>
      )}
      {icon && (
        <Image
          source={{ uri: icon }}
          style={[styles.image, { width: size, height: size }]}
          fadeDuration={10000}
          onLoad={handleImageLoad}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    position: "relative",
  },
  image: {
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default memo<Props>(AppIcon);
