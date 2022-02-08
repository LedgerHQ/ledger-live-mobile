import React, { useState, memo, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import map from "lodash/map";
import Swiper from "react-native-swiper";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { Box, Text } from "@ledgerhq/native-ui";
import { CloseMedium } from "@ledgerhq/native-ui/assets/icons";
import { urls } from "../../config/urls";
import { setCarouselVisibility } from "../../actions/settings";
import { carouselVisibilitySelector } from "../../reducers/settings";
import Card from "../Card";
import LText from "../LText";
import Button from "../Button";
import IconClose from "../../icons/Close";
import Slide from "./Slide";

const SLIDES = [
  {
    url: urls.banners.ledgerAcademy,
    name: "LedgerAcademy",
    title: <Trans i18nKey={`carousel.banners.academy.title`} />,
    description: <Trans i18nKey={`carousel.banners.academy.description`} />,
    image: require("../../images/banners/academy.png"),
    position: {
      bottom: 70,
      left: 15,
      width: 146,
      height: 93,
    },
  },
  {
    url: "ledgerlive://buy",
    name: "buyCrypto",
    title: <Trans i18nKey={`carousel.banners.buyCrypto.title`} />,
    description: <Trans i18nKey={`carousel.banners.buyCrypto.description`} />,
    image: require("../../images/banners/buycrypto.png"),
    position: {
      bottom: 70,
      left: 0,
      width: 146,
      height: 93,
    },
  },
  {
    url: "ledgerlive://swap",
    name: "Swap",
    title: <Trans i18nKey={`carousel.banners.swap.title`} />,
    description: <Trans i18nKey={`carousel.banners.swap.description`} />,
    image: require("../../images/banners/swap.png"),
    position: {
      bottom: 70,
      left: 0,
      width: 127,
      height: 100,
    },
  },
  {
    url: urls.banners.familyPack,
    name: "FamilyPack",
    title: <Trans i18nKey={`carousel.banners.familyPack.title`} />,
    description: <Trans i18nKey={`carousel.banners.familyPack.description`} />,
    image: require("../../images/banners/familypack.png"),
    position: {
      bottom: 70,
      left: 0,
      width: 180,
      height: 80,
    },
  },
];

export const getDefaultSlides = () =>
  map(SLIDES, slide => ({
    id: slide.name,
    Component: () => (
      <Slide
        url={slide.url}
        name={slide.name}
        title={slide.title}
        description={slide.description}
        image={slide.image}
        position={slide.position}
      />
    ),
  }));

const hitSlop = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

export const CAROUSEL_NONCE: number = 4;

const Carousel = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const hidden = useSelector(carouselVisibilitySelector);
  const [showDismissConfirmation, setShowDismissConfirmation] = useState(false);

  let slides = getDefaultSlides();
  slides = slides.filter(slide => {
    if (slide.start && slide.start > new Date()) {
      return false;
    }
    if (slide.end && slide.end < new Date()) {
      return false;
    }
    return true;
  });

  const onDismiss = useCallback(() => setShowDismissConfirmation(true), []);

  const onUndo = useCallback(() => setShowDismissConfirmation(false), []);
  const onConfirm = useCallback(
    () => dispatch(setCarouselVisibility(CAROUSEL_NONCE)),
    [dispatch],
  );

  if (!slides.length || hidden >= CAROUSEL_NONCE) {
    // No slides or dismissed, no problem
    return null;
  }

  return (
    <Box>
      {showDismissConfirmation ? (
        <Box height={"182px"} alignItems={"center"} p={3}>
          <Text variant={"h3"}>
            <Trans i18nKey="carousel.title" />
          </Text>
          <Text variant={"body"} color={"neutral.c70"}>
            <Trans i18nKey="carousel.description" />
          </Text>
          <View style={styles.buttonsWrapper}>
            <Button
              event="ConfirmationModalCancel"
              type="secondary"
              outline
              titleStyle={{ fontSize: 12 }}
              containerStyle={[styles.button, { marginRight: 8 }]}
              title={<Trans i18nKey="carousel.undo" />}
              onPress={onUndo}
            />
            <Button
              event="ConfirmationModalCancel"
              type="primary"
              titleStyle={{ fontSize: 12 }}
              containerStyle={styles.button}
              title={<Trans i18nKey="carousel.confirm" />}
              onPress={onConfirm}
            />
          </View>
        </Box>
      ) : (
        // $FlowFixMe
        <View>
          {/* $FlowFixMe */}
          {/* <Swiper */}
          {/*  style={styles.scrollView} */}
          {/*  autoplay */}
          {/*  autoplayTimeout={5} */}
          {/*  showsButtons={false} */}
          {/*  dotStyle={[styles.bullet, { backgroundColor: colors.fog }]} */}
          {/*  activeDotStyle={[ */}
          {/*    styles.bullet, */}
          {/*    { backgroundColor: colors.fog, opacity: 1 }, */}
          {/*  ]} */}
          {/* > */}
          <ScrollView horizontal>
            {slides.map(({ id, Component }) => (
              <Box mr={6}>
                <Component key={id} />
              </Box>
            ))}
          </ScrollView>
          {/* </Swiper> */}
          <TouchableOpacity
            style={styles.dismissCarousel}
            hitSlop={hitSlop}
            onPress={onDismiss}
          >
            <CloseMedium size={16} color={"neutral.c70"} />
          </TouchableOpacity>
        </View>
      )}
    </Box>
  );
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
    opacity: 0.5,
    margin: 4,
    marginBottom: -20,
  },
  scrollView: {},
  confirmation: {
    padding: 8,
    alignItems: "center",
  },
  buttonsWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    height: 32,
    margin: 8,
  },
  title: {
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 4,
  },
  description: {
    opacity: 0.5,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
  },
  wrapper: {
    margin: 16,
    minHeight: 100,
    position: "relative",
    borderRadius: 4,
    overflow: "hidden",
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: {
          height: 4,
        },
      },
    }),
  },
});

export default memo<{}>(Carousel);
