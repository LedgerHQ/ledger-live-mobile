// @flow

import React, { useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Trans } from "react-i18next";
import colors from "../../colors";
import BottomModal from "../../components/BottomModal";
import type { Props as BMProps } from "../../components/BottomModal";
import LText from "../../components/LText";
import Button from "../../components/Button";
import TrackScreen from "../../analytics/TrackScreen";
import { context as _ptContext } from "./Provider";
import ArrowRight from "../../icons/ArrowRight";

type Props = BMProps & {
  onPress: Function,
};

const stepTitles = {
  INSTALL_CRYPTO: "producttour.finishedmodal.installcrypto",
  CREATE_ACCOUNT: "producttour.finishedmodal.createaccount",
  RECEIVE_COINS: "producttour.finishedmodal.receivecoins",
  /*
  "BUY_COINS": ["CREATE_ACCOUNT"],
  "SEND_COINS": ["CREATE_ACCOUNT"],
  "SWAP_COINS": ["RECEIVE_COINS"],
  CUSTOMIZE_APP: [],
  */
};

const ProductTourStepFinishedBottomModal = ({
  isOpened,
  onClose,
  onPress,
  ...rest
}: Props) => {
  const ptContext = useContext(_ptContext);

  return (
    <BottomModal
      id="ProductTourStepFinishedBottomModal"
      isOpened={isOpened}
      onClose={onClose}
      style={styles.confirmationModal}
      containerStyle={styles.container}
      {...rest}
    >
      {isOpened && ptContext.currentStep ? (
        <TrackScreen
          category="ProductTourStepFinishedBottomModal"
          name={ptContext.currentStep}
        />
      ) : null}
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../../images/stepfinishedcastle.png")}
          style={styles.image}
        />
      </View>
      <LText bold style={styles.title}>
        <Trans i18nKey="producttour.finishedmodal.title" />
      </LText>
      <LText style={styles.description}>
        <Trans i18nKey={stepTitles[ptContext.currentStep]} />
      </LText>
      <View style={styles.confirmationFooter}>
        <Button
          event={`ProductTourStepFinishedBottomModal continue ${ptContext.currentStep ||
            ""}`}
          containerStyle={styles.confirmationButton}
          type="negative2Primary"
          title={<Trans i18nKey="producttour.finishedmodal.cta" />}
          onPress={onPress}
          IconRight={ArrowRight}
        />
      </View>
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  confirmationModal: {
    paddingVertical: 24,
    paddingTop: 74,
    paddingHorizontal: 16,
    backgroundColor: colors.ledgerGreen,
  },
  container: {
    backgroundColor: colors.ledgerGreen,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    color: colors.white,
  },
  description: {
    marginVertical: 32,
    textAlign: "center",
    fontSize: 14,
    color: colors.white,
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
  icon: {
    alignSelf: "center",
    backgroundColor: colors.lightOrange,
    width: 56,
    borderRadius: 28,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  image: {
    position: "absolute",
    top: -92 - 74,
    height: 146,
    width: 137,
  },
});

export default ProductTourStepFinishedBottomModal;
