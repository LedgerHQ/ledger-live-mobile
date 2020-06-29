// @flow

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Swiper from "react-native-swiper";
import { dismissCarousel } from "../../actions/appstate";
import { dismissedCarouselSelector } from "../../reducers/appstate";
import LedgerAcademy from "./slides/LedgerAcademy";
import BuyCrypto from "./slides/BuyCrypto";
import BackupPack from "./slides/BackupPack";
import StakeCosmos from "./slides/StakeCosmos";
import IconClose from "../../icons/Close";
import colors from "../../colors";

const Carousel = () => {
  const slides = getDefaultSlides();
  const dispatch = useDispatch();
  const hidden = useSelector(dismissedCarouselSelector);
  return hidden ? null : (
    <View style={styles.wrapper}>
      <Swiper
        style={styles.scrollView}
        autoplay
        autoplayTimeout={5}
        showsButtons={false}
        dotStyle={styles.bullet}
        activeDotStyle={[styles.bullet, { opacity: 1 }]}
      >
        {slides.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </Swiper>
      <TouchableOpacity
        style={styles.dismissCarousel}
        onPress={() => dispatch(dismissCarousel())}
      >
        <IconClose color={colors.white} size={16} />
      </TouchableOpacity>
    </View>
  );
};

export const getDefaultSlides = () => {
  return [
    {
      id: "academy",
      Component: () => <LedgerAcademy />,
    },
    {
      id: "buyCrypto",
      Component: () => <BuyCrypto />,
    },
    {
      id: "backupPack",
      Component: () => <BackupPack />,
    },
    {
      id: "stakeCosmos",
      Component: () => <StakeCosmos />,
    },
  ];
};

const styles = StyleSheet.create({
  dismissCarousel: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  bullet: {
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: "white",
    opacity: 0.5,
    margin: 4,
    marginBottom: -20,
  },
  scrollView: {
    height: 193,
    backgroundColor: "#32415E",
  },
  wrapper: {
    margin: 16,
    position: "relative",
    borderRadius: 4,
    overflow: "hidden",
  },
  label: {
    fontSize: 40,
    color: "white",
  },
});

export default Carousel;
