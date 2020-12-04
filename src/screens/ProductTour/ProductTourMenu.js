// @flow

import React, { useContext } from "react";
import { Trans } from "react-i18next";
import _ from "lodash";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LText from "../../components/LText";
import colors from "../../colors";
import { context, STEPS, setStep, completeStep } from "./Provider";
import { ScreenName } from "../../const";

type Props = {
  navigation: any,
};

let to;

const ProductTourMenu = ({ navigation }: Props) => {
  const ptContext = useContext(context);

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
    <View style={styles.root}>
      <LText secondary style={styles.title} bold>
        ProductTourMenu ({ptContext.completedSteps.length} /{" "}
        {Object.keys(STEPS).length})
      </LText>
      {_.map(STEPS, (_, step) => (
        <TouchableOpacity
          key={step}
          onPress={() => goTo(step)}
          onLongPress={() => completeStep(step)}
          delayLongPress={2000}
          disabled={!isAccessible(step) || isComplete(step)}
        >
          <LText>
            {step} (
            {isComplete(step)
              ? "done"
              : isAccessible(step)
              ? "unlocked"
              : "locked"}
            )
          </LText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    color: colors.darkBlue,
    justifyContent: "center",
  },
});

export default ProductTourMenu;
