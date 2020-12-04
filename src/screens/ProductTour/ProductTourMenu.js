// @flow

import React, { useContext } from "react";
import { Trans } from "react-i18next";
import _ from "lodash";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LText from "../../components/LText";
import colors from "../../colors";
import { context, STEPS, setStep } from "./Provider";
import { ScreenName } from "../../const";

type Props = {
  navigation: any,
};

const ProductTourMenu = ({ navigation }: Props) => {
  const ptContext = useContext(context);

  const isAccessible = step =>
    _.every(STEPS[step], step => ptContext.completedSteps.includes(step));

  const goTo = step => {
    setStep(step);
    navigation.navigate(ScreenName.ProductTourStepStart);
  };

  useFocusEffect(() => {
    if (ptContext.currentStep) {
      setStep(null);
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
          disabled={!isAccessible(step)}
        >
          <LText>
            {step} ({isAccessible(step) ? "unlocked" : "locked"})
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
