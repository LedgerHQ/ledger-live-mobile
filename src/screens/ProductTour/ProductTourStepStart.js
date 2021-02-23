// @flow

import React, { useContext, useState, useCallback } from "react";
import { Trans } from "react-i18next";
import { View, StyleSheet, Image, SafeAreaView } from "react-native";
import { useHeaderHeight } from "@react-navigation/stack";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import LText from "../../components/LText";
import Button from "../../components/Button";
import AnimatedSvgBackground from "../../components/AnimatedSvgBackground";
import { context } from "./Provider";
import { NavigatorName, ScreenName } from "../../const";
import { navigate } from "../../rootnavigation";
import ArrowRight from "../../icons/ArrowRight";

const stepInfos = {
  INSTALL_CRYPTO: [
    "producttour.stepstart.installcrypto",
    [
      "producttour.stepstart.installcryptodetails",
      "producttour.stepstart.installcryptodetails2",
    ],
    {
      file: require("../../images/producttour/blue/installcrypto.png"),
      size: {
        width: 131,
        height: 151,
      },
    },
  ],
  CREATE_ACCOUNT: [
    "producttour.stepstart.createaccount",
    [
      "producttour.stepstart.createaccountdetails",
      "producttour.stepstart.createaccountdetails2",
    ],
    {
      file: require("../../images/producttour/blue/createaccount.png"),
      size: {
        width: 148,
        height: 148,
      },
      offset: {
        left: -13,
      },
    },
  ],
  RECEIVE_COINS: [
    "producttour.stepstart.receivecoins",
    [
      "producttour.stepstart.receivecoinsdetails",
      "producttour.stepstart.receivecoinsdetails2",
    ],
    {
      file: require("../../images/producttour/blue/receivecoins.png"),
      size: {
        width: 149,
        height: 160,
      },
    },
  ],
  BUY_COINS: [
    "producttour.stepstart.buycoins",
    [
      "producttour.stepstart.buycoinsdetails",
      "producttour.stepstart.buycoinsdetails2",
    ],
    {
      file: require("../../images/producttour/blue/buycoins.png"),
      size: {
        width: 152,
        height: 160,
      },
    },
  ],
  SEND_COINS: [
    "producttour.stepstart.sendcoins",
    [
      "producttour.stepstart.sendcoinsdetails",
      "producttour.stepstart.sendcoinsdetails2",
    ],
    {
      file: require("../../images/producttour/blue/sendcoins.png"),
      size: {
        width: 216,
        height: 161,
      },
    },
  ],
  SWAP_COINS: [
    "producttour.stepstart.swapcoins",
    [
      "producttour.stepstart.swapcoinsdetails",
      "producttour.stepstart.swapcoinsdetails2",
    ],
    {
      file: require("../../images/producttour/blue/swapcoins.png"),
      size: {
        width: 184,
        height: 160,
      },
    },
  ],
  CUSTOMIZE_APP: [
    "producttour.stepstart.customizeapp",
    [
      "producttour.stepstart.customizeappdetails",
      "producttour.stepstart.customizeappdetails2",
    ],
    {
      file: require("../../images/producttour/blue/customizeapp.png"),
      size: {
        width: 156,
        height: 160,
      },
    },
  ],
};

const ProductTourStepStart = () => {
  const { colors } = useTheme();
  const ptContext = useContext(context);
  const headerHeight = useHeaderHeight();
  const [swiperKey, setSwiperKey] = useState();

  // workaround bug
  useFocusEffect(
    useCallback(() => {
      setSwiperKey(ptContext.currentStep);
    }, [ptContext.currentStep]),
  );

  const goTo = () => {
    switch (ptContext.currentStep) {
      case "INSTALL_CRYPTO":
      case "CREATE_ACCOUNT":
      case "RECEIVE_COINS":
      case "BUY_COINS":
      case "SEND_COINS":
      case "SWAP_COINS":
        navigate(NavigatorName.Main, {
          screen: ScreenName.Portfolio,
        });
        break;
      case "CUSTOMIZE_APP":
        navigate(NavigatorName.Base, {
          screen: NavigatorName.CustomizeApp,
        });
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.live }}>
      {ptContext.currentStep ? (
        <View style={styles.root}>
          <View style={{ flex: 1 }}>
            <AnimatedSvgBackground
              color={"#587ED4"}
              style={[styles.svg, { height: 218 - headerHeight }]}
            />
            <Image
              source={stepInfos[ptContext.currentStep][2]?.file}
              style={[
                styles.image,
                stepInfos[ptContext.currentStep][2]?.size,
                stepInfos[ptContext.currentStep][2]?.offset,
              ]}
            />
            <LText style={styles.title} bold>
              <Trans i18nKey={stepInfos[ptContext.currentStep][0]} />
            </LText>
            <Swiper key={swiperKey} activeDotColor="#FFF">
              {stepInfos[ptContext.currentStep][1].map(key => (
                <View key={key}>
                  <LText style={styles.details}>
                    <Trans i18nKey={key} />
                  </LText>
                </View>
              ))}
            </Swiper>
          </View>
          <Button
            type="negativePrimary"
            event={`step start tour ${ptContext.currentStep}`}
            onPress={goTo}
            title={<Trans i18nKey="producttour.stepstart.cta" />}
            IconRight={ArrowRight}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    flex: 1,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    color: "#FFF",
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: "#FFF",
  },
  image: {
    alignSelf: "center",
    marginBottom: 21,
    position: "relative",
  },
  svg: {
    position: "absolute",
    left: -16,
    right: -16,
    zIndex: -1,
    top: 0,
  },
});

export default ProductTourStepStart;
