import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import map from "lodash/map";
import { Trans } from "react-i18next";
import { Box } from "@ledgerhq/native-ui";
import { CloseMedium } from "@ledgerhq/native-ui/assets/icons";
import styled from "styled-components/native";
import Animated, { FadeOut, Layout } from "react-native-reanimated";
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
import { track } from "../../analytics";

const DismissCarousel = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
`;

export const SLIDES = [
  {
    url: urls.banners.ledgerAcademy,
    name: "LedgerAcademy",
    title: <Trans i18nKey={`carousel.banners.academy.title`} />,
    description: <Trans i18nKey={`carousel.banners.academy.description`} />,
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
    title: <Trans i18nKey={`carousel.banners.buyCrypto.title`} />,
    description: <Trans i18nKey={`carousel.banners.buyCrypto.description`} />,
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
    title: <Trans i18nKey={`carousel.banners.swap.title`} />,
    description: <Trans i18nKey={`carousel.banners.swap.description`} />,
    icon: (
      <Illustration lightSource={SwapLight} darkSource={SwapDark} size={84} />
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
    title: <Trans i18nKey={`carousel.banners.familyPack.title`} />,
    description: <Trans i18nKey={`carousel.banners.familyPack.description`} />,
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

type CarouselCardProps = {
  id: string;
  children: React.ReactNode;
  onHide: (cardId: string) => void;
  index?: number;
};

const CarouselCard = ({ id, children, onHide, index }: CarouselCardProps) => (
  <Box key={`container_${id}`} mr={6} ml={index === 0 ? 6 : 0}>
    {children}
    <DismissCarousel hitSlop={hitSlop} onPress={() => onHide(id)}>
      <CloseMedium size={16} color="neutral.c70" />
    </DismissCarousel>
  </Box>
);

// TODO : make it generic in the ui
const CarouselCardContainer = ({
  id,
  children,
  onHide,
  index,
}: CarouselCardProps) => (
  <Animated.View exiting={FadeOut} layout={Layout.delay(200)}>
    <CarouselCard id={id} index={index} onHide={onHide}>
      {children}
    </CarouselCard>
  </Animated.View>
);

type Props = {
  cardsVisibility: boolean[];
};

const Carousel = ({ cardsVisibility }: Props) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPositionX, setCurrentPositionX] = useState(0);

  const slides = useMemo(
    () =>
      getDefaultSlides().filter(slide => {
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
      }),
    [cardsVisibility],
  );

  const onHide = useCallback(
    cardId => {
      const slide = SLIDES.find(slide => slide.name === cardId);
      if (slide) {
        track("Portfolio Recommended CloseUrl", {
          url: slide.url,
        });
      }
      dispatch(setCarouselVisibility({ ...cardsVisibility, [cardId]: false }));
    },
    [dispatch, cardsVisibility],
  );

  const onScrollEnd = useCallback(event => {
    setCurrentPositionX(
      event.nativeEvent.contentOffset.x +
        event.nativeEvent.layoutMeasurement.width,
    );
  }, []);

  const onScrollViewContentChange = useCallback(
    contentWidth => {
      // 264px = CarouselCard width + padding
      if (currentPositionX > contentWidth) {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    },
    [currentPositionX],
  );

  if (!slides.length) {
    // No slides or dismissed, no problem
    return null;
  }

  return (
    <ScrollView
      horizontal
      ref={scrollViewRef}
      onMomentumScrollEnd={onScrollEnd}
      onContentSizeChange={onScrollViewContentChange}
      showsHorizontalScrollIndicator={false}
    >
      {slides.map(({ id, Component }, index) => (
        <CarouselCardContainer
          key={id + index}
          id={id}
          index={index}
          onHide={onHide}
        >
          <Component key={id} />
        </CarouselCardContainer>
      ))}
    </ScrollView>
  );
};

export default memo<Props>(Carousel);
