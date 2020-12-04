// @flow

import React, { useContext, useState } from "react";
import { Trans } from "react-i18next";
import _ from "lodash";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import LText from "../../components/LText";
import Check from "../../icons/Check";
import Lock from "../../icons/Lock";
import colors from "../../colors";
import { context, STEPS, setStep, completeStep } from "./Provider";
import { ScreenName } from "../../const";
import StepLockedBottomModal from "./StepLockedBottomModal";

const forceInset = { bottom: "always" };

const stepTitles = {
  INSTALL_CRYPTO: [
    "producttour.menu.installcrypto",
    "producttour.menu.cryptoinstalled",
  ],
  CREATE_ACCOUNT: [
    "producttour.menu.createaccount",
    "producttour.menu.accountcreated",
  ],
  RECEIVE_COINS: [
    "producttour.menu.receivecoins",
    "producttour.menu.coinsreceived",
  ],
  /*
  "BUY_COINS": ["CREATE_ACCOUNT"],
  "SEND_COINS": ["CREATE_ACCOUNT"],
  "SWAP_COINS": ["RECEIVE_COINS"],
  CUSTOMIZE_APP: [],
  */
};

const stepProps = {
  isComplete: Function,
  isAccessible: Function,
  goTo: Function,
  setStepLockedModal: Function,
  step: String,
};

const Step = ({
  isComplete,
  isAccessible,
  goTo,
  step,
  setStepLockedModal,
}: stepProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.step,
        isComplete(step)
          ? styles.stepComplete
          : isAccessible(step)
          ? styles.stepAccessible
          : styles.stepLocked,
      ]}
      onPress={() => {
        if (!isAccessible(step)) {
          return setStepLockedModal(true);
        }
        goTo(step);
      }}
      onLongPress={() => completeStep(step)}
      delayLongPress={2000}
      disabled={isComplete(step)}
    >
      {isComplete(step) || isAccessible(step) ? (
        <View style={styles.checkContainer}>
          <View
            style={[
              styles.checkboxContainer,
              isComplete(step) ? styles.checkboxContainerChecked : null,
            ]}
          >
            {isComplete(step) ? (
              <Check size={10} color={colors.ledgerGreen} />
            ) : null}
          </View>
          {isComplete(step) ? (
            <LText style={styles.completedText}>
              <Trans i18nKey="producttour.menu.complete" />
            </LText>
          ) : null}
        </View>
      ) : null}
      {!isAccessible(step) && !isComplete(step) ? (
        <View style={styles.lockContainer}>
          <Lock size={12} color={colors.white} />
        </View>
      ) : null}
      <LText style={styles.stepTitle}>
        <Trans i18nKey={stepTitles[step][isComplete(step) ? 1 : 0]} />
      </LText>
      <Image
        source={require("../../images/stepcastle.png")}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};

type Props = {
  navigation: any,
};

let to;

const ProductTourMenu = ({ navigation }: Props) => {
  const ptContext = useContext(context);
  const [stepLockedModal, setStepLockedModal] = useState(false);

  const isAccessible = step =>
    _.every(STEPS[step], step => ptContext.completedSteps.includes(step));
  const isComplete = step => ptContext.completedSteps.includes(step);

  const goTo = step => {
    clearTimeout(to);
    setStep(step);
    navigation.navigate(ScreenName.ProductTourStepStart);
  };

  // eslint-disable-next-line consistent-return
  useFocusEffect(() => {
    if (ptContext.currentStep) {
      // timeout avoid ui glitch
      to = setTimeout(() => setStep(null), 1000);
      // we don't cancel it on purpose
    }
  }, [ptContext.currentStep]);

  return (
    <>
      <View style={styles.header}>
        <LText secondary style={styles.title} bold>
          <Trans i18nKey="producttour.menu.title" />
        </LText>
      </View>
      <SafeAreaView style={{ flex: 1 }} forceInset={forceInset}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.root}>
          {_.map(STEPS, (_, step) => (
            <View
              key={`${step}-${ptContext.completedSteps.length}`}
              style={styles.stepContainer}
            >
              <Step
                step={step}
                isComplete={isComplete}
                isAccessible={isAccessible}
                goTo={goTo}
                setStepLockedModal={setStepLockedModal}
              />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      <StepLockedBottomModal
        isOpened={!!stepLockedModal}
        onPress={() => setStepLockedModal(false)}
        onClose={() => setStepLockedModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 128,
    height: 70,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxContainer: {
    height: 16,
    width: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.live,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  checkboxContainerChecked: {
    backgroundColor: colors.white,
  },
  completedText: {
    color: colors.white,
    fontSize: 8,
  },
  lockContainer: {
    marginBottom: 20,
  },
  root: {
    marginHorizontal: 12,
    marginTop: 12,
    flexWrap: "wrap",
    alignContent: "stretch",
    flexDirection: "row",
  },
  stepContainer: {
    width: "50%",
    padding: 12,
  },
  step: {
    width: "100%",
    padding: 16,
    borderRadius: 4,
    paddingBottom: 80,
  },
  stepComplete: {
    backgroundColor: colors.ledgerGreen,
  },
  stepAccessible: {
    backgroundColor: colors.live,
  },
  stepLocked: {
    backgroundColor: colors.live,
    opacity: 0.4,
  },
  stepTitle: {
    color: colors.white,
    fontSize: 22,
  },
  header: {
    backgroundColor: colors.live,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 43,
  },
  title: {
    fontSize: 28,
    color: colors.white,
  },
});

export default ProductTourMenu;
