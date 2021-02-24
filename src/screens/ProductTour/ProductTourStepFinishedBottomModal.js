// @flow

import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import BottomModal from "../../components/BottomModal";
import LText from "../../components/LText";
import Button from "../../components/Button";
import { screen } from "../../analytics/segment";
import {
  context as _ptContext,
  enableFinishedModal,
  completeStep,
} from "./Provider";
import ArrowRight from "../../icons/ArrowRight";
import { ScreenName, NavigatorName } from "../../const";
import { navigate } from "../../rootnavigation";

const stepTitles = {
  INSTALL_CRYPTO: [
    "producttour.finishedmodal.installcrypto",
    {
      file: require("../../images/producttour/green/installcrypto.png"),
      size: {
        width: 131,
        height: 151,
      },
    },
  ],
  CREATE_ACCOUNT: [
    "producttour.finishedmodal.createaccount",
    {
      file: require("../../images/producttour/green/createaccount.png"),
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
    "producttour.finishedmodal.receivecoins",
    {
      file: require("../../images/producttour/green/receivecoins.png"),
      size: {
        width: 149,
        height: 160,
      },
    },
  ],
  BUY_COINS: [
    "producttour.finishedmodal.buycoins",
    {
      file: require("../../images/producttour/green/buycoins.png"),
      size: {
        width: 175,
        height: 157,
      },
    },
  ],
  SEND_COINS: [
    "producttour.finishedmodal.sendcoins",
    {
      file: require("../../images/producttour/green/sendcoins.png"),
      size: {
        width: 176,
        height: 131,
      },
    },
  ],
  SWAP_COINS: [
    "producttour.finishedmodal.swapcoins",
    {
      file: require("../../images/producttour/green/swapcoins.png"),
      size: {
        width: 184,
        height: 160,
      },
    },
  ],
  CUSTOMIZE_APP: [
    "producttour.finishedmodal.customizeapp",
    {
      file: require("../../images/producttour/green/customizeapp.png"),
      size: {
        width: 210,
        height: 197,
      },
    },
  ],
};

const ProductTourStepFinishedBottomModal = () => {
  const { colors } = useTheme();
  const ptContext = useContext(_ptContext);

  const isOpened =
    ptContext.currentStep && ptContext.finishedModal === ptContext.currentStep;

  const onClose = () => {
    if (ptContext.currentStep) {
      completeStep(ptContext.currentStep);
    }
    navigate(NavigatorName.ProductTour, {
      screen: ScreenName.ProductTourMenu,
    });
  };

  useEffect(() => {
    if (isOpened) {
      screen("ProductTourStepFinishedBottomModal", ptContext.currentStep);
    }
  }, [isOpened, ptContext.currentStep]);

  return (
    <BottomModal
      isOpened={!!isOpened}
      onClose={onClose}
      style={[
        styles.confirmationModal,
        { backgroundColor: colors.ledgerGreen },
      ]}
      containerStyle={{ backgroundColor: colors.ledgerGreen }}
    >
      {isOpened && ptContext.currentStep ? (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={stepTitles[ptContext.currentStep][1]?.file}
              style={[
                styles.image,
                stepTitles[ptContext.currentStep][1]?.size,
                stepTitles[ptContext.currentStep][1]?.offset,
              ]}
            />
          </View>
          <LText bold style={[styles.title, styles.textWhite]}>
            <Trans i18nKey="producttour.finishedmodal.title" />
          </LText>
          <LText style={[styles.description, styles.textWhite]}>
            <Trans i18nKey={stepTitles[ptContext.currentStep][0]} />
          </LText>
          <View style={styles.confirmationFooter}>
            <Button
              event={`ProductTourStepFinishedBottomModal continue ${ptContext.currentStep ||
                ""}`}
              containerStyle={styles.confirmationButton}
              type="negative2Primary"
              title={<Trans i18nKey="producttour.finishedmodal.cta" />}
              onPress={onClose}
              IconRight={ArrowRight}
            />
          </View>
        </>
      ) : null}
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  confirmationModal: {
    paddingVertical: 24,
    paddingTop: 74,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
  },
  description: {
    marginVertical: 32,
    textAlign: "center",
    fontSize: 14,
  },
  confirmationFooter: {
    justifyContent: "flex-end",
  },
  confirmationButton: {
    flexGrow: 1,
  },
  confirmationLastButton: {
    marginTop: 16,
  },
  imageContainer: {
    alignItems: "center",
    height: 0,
    marginBottom: 20,
  },
  image: {
    position: "relative",
    top: -92 - 74,
  },
  textWhite: {
    color: "#FFF",
  },
});

export default ProductTourStepFinishedBottomModal;
