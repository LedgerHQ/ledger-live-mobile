// @flow

import React, { useContext } from "react";
import { Trans } from "react-i18next";
import { View, StyleSheet, Image, SafeAreaView } from "react-native";
import { useHeaderHeight } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import LText from "../../components/LText";
import Button from "../../components/Button";
import AnimatedSvgBackground from "../../components/AnimatedSvgBackground";
import { context } from "./Provider";
import { NavigatorName } from "../../const";
import { navigate } from "../../rootnavigation";
import ArrowRight from "../../icons/ArrowRight";

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
  BUY_COINS: [
    "producttour.stepstart.buycoins",
    "producttour.stepstart.buycoinsdetails",
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
    "producttour.stepstart.sendcoinsdetails",
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
    "producttour.stepstart.swapcoinsdetails",
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
    "producttour.stepstart.customizeappdetails",
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
      case "BUY_COINS":
        navigate(NavigatorName.Base, {
          screen: NavigatorName.ExchangeBuyFlow,
        });
        break;
      case "SEND_COINS":
        navigate(NavigatorName.Base, {
          screen: NavigatorName.SendFunds,
        });
        break;
      case "SWAP_COINS":
        navigate(NavigatorName.Base, {
          screen: NavigatorName.Swap,
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
    <SafeAreaView style={[styles.root, { backgroundColor: colors.live }]}>
      {ptContext.currentStep ? (
        <>
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
        </>
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
