import React, { memo, useCallback } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import map from "lodash/map";
import { Trans } from "react-i18next";
import { Box } from "@ledgerhq/native-ui";
import { CloseMedium } from "@ledgerhq/native-ui/assets/icons";
import styled from "styled-components/native";
import { urls } from "../../config/urls";
import { setCarouselVisibility } from "../../actions/settings";
import Slide from "./Slide";
import Illustration from "../../images/illustration/Illustration";
import AcademyLight from "../../images/illustration/Academy.light.png";
import AcademyDark from "../../images/illustration/Academy.dark.png";
import BuyCryptoLight from "../../images/illustration/BuyCrypto.light.png";
import BuyCryptoDark from "../../images/illustration/BuyCrypto.dark.png";
import SwapLight from "../../images/illustration/Swap.light.png";
import SwapDark from "../../images/illustration/Swap.dark.png";
import FamilyPackLight from "../../images/illustration/FamilyPack.light.png";
import FamilyPackDark from "../../images/illustration/FamilyPack.dark.png";

const DismissCarousel = styled(TouchableOpacity)`
  position: absolute;
  top: 10;
  right: 10;
  width: 30;
  height: 30;
  alignItems: center;
  justifyContent: center;
  borderColor: white;
`;

export const SLIDES = [
  {
    url: urls.banners.ledgerAcademy,
    name: "LedgerAcademy",
    title: <Trans i18nKey={`v3.carousel.banners.academy.title`} />,
    description: <Trans i18nKey={`v3.carousel.banners.academy.description`} />,
    // image: require("../../images/banners/academy.png"),
    icon: (
      <Illustration
        lightSource={AcademyLight}
        darkSource={AcademyDark}
        size={84}
      />
    ),
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
    title: <Trans i18nKey={`v3.carousel.banners.buyCrypto.title`} />,
    description: (
      <Trans i18nKey={`v3.carousel.banners.buyCrypto.description`} />
    ),
    // image: require("../../images/banners/buycrypto.png"),
    icon: (
      <Illustration
        lightSource={BuyCryptoLight}
        darkSource={BuyCryptoDark}
        size={84}
      />
    ),
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
    title: <Trans i18nKey={`v3.carousel.banners.swap.title`} />,
    description: <Trans i18nKey={`v3.carousel.banners.swap.description`} />,
    // image: require("../../images/banners/swap.png"),
    icon: (
      <Illustration
        lightSource={SwapLight}
        darkSource={SwapDark}
        size={84}
      />
    ),
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
    title: <Trans i18nKey={`v3.carousel.banners.familyPack.title`} />,
    description: (
      <Trans i18nKey={`v3.carousel.banners.familyPack.description`} />
    ),
    // image: require("../../images/banners/familypack.png"),
    icon: (
      <Illustration
        lightSource={FamilyPackLight}
        darkSource={FamilyPackDark}
        size={84}
      />
    ),
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
        icon={slide.icon}
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

type Props = {
  cardsVisibility: boolean[];
};

const Carousel = ({ cardsVisibility }: Props) => {
  const dispatch = useDispatch();

  let slides = getDefaultSlides();
  slides = slides.filter((slide) => {
    if (!cardsVisibility[slide.id]) {
      return false;
    }
    if (slide.start && slide.start > new Date()) {
      return false;
    }
    if (slide.end && slide.end < new Date()) {
      return false;
    }
    return true;
  });

  const onHide = useCallback(
    cardId => {
      dispatch(setCarouselVisibility({ ...cardsVisibility, [cardId]: false }));
    },
    [dispatch, cardsVisibility],
  );

  if (!slides.length) {
    // No slides or dismissed, no problem
    return null;
  }

  return (
    <Box>
      <View>
        <ScrollView horizontal>
          {slides.map(({ id, Component }) => (
            <Box mr={6}>
              <Component key={id} />
              <DismissCarousel hitSlop={hitSlop} onPress={() => onHide(id)}>
                <CloseMedium size={16} color={"neutral.c70"} />
              </DismissCarousel>
            </Box>
          ))}
        </ScrollView>
      </View>
    </Box>
  );
};

export default memo<Props>(Carousel);
