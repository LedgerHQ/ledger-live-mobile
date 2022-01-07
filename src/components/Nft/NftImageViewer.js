// @flow

import React from "react";
import NftImage from "./NftImage";

import { View, StyleSheet } from "react-native";

import LText from "../LText";

type Props = {
  route: {
    params?: RouteParams,
  },
};

type RouteParams = {
  media: string,
  status: string,
};

const NftViewer = ({ route }: Props) => {
  // T

  const { params } = route;
  const { media, status } = params;

  return (
    <View style={styles.imageContainer}>
      <NftImage src={media} status={status} style={styles.image} hackWidth={10000} zoomable />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    borderRadius: 4,
    marginBottom: 12,
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
  },
});

export default NftViewer;
