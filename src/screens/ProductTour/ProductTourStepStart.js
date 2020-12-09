// @flow

import React, { useContext } from "react";
import { Trans } from "react-i18next";
import { View, StyleSheet, Image } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useHeaderHeight } from '@react-navigation/stack';
import LText from "../../components/LText";
import Button from "../../components/Button";
import AnimatedSvgBackground from "../../components/AnimatedSvgBackground";
import colors from "../../colors";
import { context } from "./Provider";
import { NavigatorName } from "../../const";
import { navigate } from "../../rootnavigation";
import ArrowRight from "../../icons/ArrowRight";

const forceInset = { bottom: "always" };

const stepInfos = {
  INSTALL_CRYPTO: [
    "producttour.stepstart.installcrypto",
    "producttour.stepstart.installcryptodetails",
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
    "producttour.stepstart.createaccountdetails",
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
    "producttour.stepstart.receivecoinsdetails",
    {
      file: require("../../images/producttour/blue/receivecoins.png"),
      size: {
        width: 149,
        height: 160,
      },
    },
  ],
  /*
  "BUY_COINS": ["CREATE_ACCOUNT"],
  "SEND_COINS": ["CREATE_ACCOUNT"],
  "SWAP_COINS": ["RECEIVE_COINS"],
  CUSTOMIZE_APP: [],
  */
};

const ProductTourStepStart = () => {
  const ptContext = useContext(context);
  const headerHeight = useHeaderHeight();

  const goTo = () => {
    switch (ptContext.currentStep) {
      case "INSTALL_CRYPTO":
        navigate(NavigatorName.Main, {
          screen: NavigatorName.Manager,
        });
        break;
      case "CREATE_ACCOUNT":
        navigate(NavigatorName.Base, {
          screen: NavigatorName.AddAccounts,
        });
        break;
      case "RECEIVE_COINS":
        navigate(NavigatorName.Base, {
          screen: NavigatorName.ReceiveFunds,
        });
        break;
      case "CUSTOMIZE_APP":
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView forceInset={forceInset} style={styles.root}>
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
        <LText style={styles.details}>
          <Trans i18nKey={stepInfos[ptContext.currentStep][1]} />
        </LText>
      </View>
      <Button
        type="negativePrimary"
        event={`step start tour ${ptContext.currentStep}`}
        onPress={goTo}
        title={<Trans i18nKey="producttour.stepstart.cta" />}
        IconRight={ArrowRight}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    backgroundColor: colors.live,
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: colors.white,
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: colors.white,
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
