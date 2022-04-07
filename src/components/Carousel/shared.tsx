import React from "react";
import { Platform } from "react-native";
import { urls } from "../../config/urls";
import Slide from "./Slide";
import Illustration from "../../images/illustration/Illustration";
import { width } from "../../helpers/normalizeSize";

const illustrations = {
  dark: {
    academy: require("../../images/illustration/Dark/_063.png"),
    swap: require("../../images/illustration/Dark/_025.png"),
    familyPack: require("../../images/illustration/Dark/_FamilyPackX.png"),
    familyPackX: require("../../images/illustration/Dark/_FamilyPackX.png"),
    market: require("../../images/illustration/Dark/_Market.png"),
    buy: require("../../images/illustration/Dark/_048.png"),
    lido: require("../../images/illustration/Dark/_Lido.png"),
  },
  light: {
    academy: require("../../images/illustration/Light/_063.png"),
    swap: require("../../images/illustration/Light/_025.png"),
    familyPack: require("../../images/illustration/Light/_FamilyPackX.png"),
    familyPackX: require("../../images/illustration/Light/_FamilyPackX.png"),
    market: require("../../images/illustration/Light/_Market.png"),
    buy: require("../../images/illustration/Light/_048.png"),
    lido: require("../../images/illustration/Light/_Lido.png"),
  },
};

const AcademySlide = {
  url: urls.banners.ledgerAcademy,
  name: "takeTour",
  title: "carousel.banners.tour.title",
  description: "carousel.banners.tour.description",
  cta: "carousel.banners.tour.cta",
  icon: (
    <Illustration
      lightSource={illustrations.light.academy}
      darkSource={illustrations.dark.academy}
      size={84}
    />
  ),
  position: {
    bottom: 70,
    left: 15,
    width: 146,
    height: 93,
  },
};

const BuySlide = {
  url: "ledgerlive://buy",
  name: "buyCrypto",
  title: "carousel.banners.buyCrypto.title",
  description: "carousel.banners.buyCrypto.description",
  cta: "carousel.banners.buyCrypto.cta",
  icon: (
    <Illustration
      lightSource={illustrations.light.buy}
      darkSource={illustrations.dark.buy}
      size={84}
    />
  ),
  position: {
    bottom: 70,
    left: 0,
    width: 146,
    height: 93,
  },
};

const SwapSlide = {
  url: "ledgerlive://swap",
  name: "Swap",
  title: "carousel.banners.swap.title",
  description: "carousel.banners.swap.description",
  cta: "carousel.banners.swap.cta",
  icon: (
    <Illustration
      lightSource={illustrations.light.swap}
      darkSource={illustrations.dark.swap}
      size={84}
    />
  ),
  position: {
    bottom: 70,
    left: 0,
    width: 127,
    height: 100,
  },
};

const LidoSlide = {
  url: "ledgerlive://discover/lido",
  name: "Lido",
  title: "carousel.banners.lido.title",
  description: "carousel.banners.lido.description",
  cta: "carousel.banners.lido.cta",
  icon: (
    <Illustration
      lightSource={illustrations.light.lido}
      darkSource={illustrations.dark.lido}
      size={84}
    />
  ),
  position: {
    bottom: 70,
    left: 0,
    width: 127,
    height: 100,
  },
};

const MarketSlide = {
  url: "ledgerlive://market",
  name: "Market",
  title: "carousel.banners.market.title",
  description: "carousel.banners.market.description",
  cta: "carousel.banners.market.cta",
  icon: (
    <Illustration
      lightSource={illustrations.light.market}
      darkSource={illustrations.dark.market}
      size={84}
    />
  ),
  position: {
    bottom: 70,
    left: 0,
    width: 180,
    height: 80,
  },
};

/** 
const FamilyPackSlide = {
  url: urls.banners.familyPack,
  name: "FamilyPack",
  title: "carousel.banners.familyPack.title",
  description: "carousel.banners.familyPack.description",
  cta: "carousel.banners.familyPack.cta",
  icon: (
    <Illustration
      lightSource={illustrations.light.familyPack}
      darkSource={illustrations.dark.familyPack}
      size={84}
    />
  ),
  position: {
    bottom: 70,
    left: 0,
    width: 180,
    height: 80,
  },
};
*/

const FamilyPackXSlide = {
  url: urls.banners.familyPackX,
  name: "FamilyPack",
  title: "carousel.banners.familyPackX.title",
  description: "carousel.banners.familyPackX.description",
  cta: "carousel.banners.familyPackX.cta",
  icon: (
    <Illustration
      lightSource={illustrations.light.familyPackX}
      darkSource={illustrations.dark.familyPackX}
      size={84}
    />
  ),
  position: {
    bottom: 70,
    left: 0,
    width: 180,
    height: 80,
  },
};

export const SLIDES =
  Platform.OS === "ios"
    ? [SwapSlide, BuySlide, MarketSlide, FamilyPackXSlide, AcademySlide]
    : [
        SwapSlide,
        LidoSlide,
        BuySlide,
        MarketSlide,
        FamilyPackXSlide,
        AcademySlide,
      ];

export const WIDTH = width * 0.8;

export const getDefaultSlides = () =>
  SLIDES.map((slide: any) => ({
    id: slide.name,
    Component: () => (
      <Slide
        url={slide.url}
        name={slide.name}
        title={slide.title}
        description={slide.description}
        cta={slide.cta}
        image={slide.image}
        icon={slide.icon}
        position={slide.position}
        width={WIDTH}
      />
    ),
  }));

export const CAROUSEL_NONCE: number = 6;
