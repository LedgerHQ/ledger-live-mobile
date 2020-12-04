// @flow

import React, { useContext } from "react";
import { Trans } from "react-i18next";
import _ from "lodash";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import LText from "../../components/LText";
import colors from "../../colors";
import { context, STEPS, setStep } from "./Provider";
import { ScreenName } from "../../const";

type Props = {
  navigation: any,
};

const ProductTourStepStart = ({ navigation }: Props) => {
  const ptContext = useContext(context);

  const goTo = () => {
    console.log(ptContext.currentStep);
  };

  return (
    <View style={styles.root}>
      <LText secondary style={styles.title} bold>
        ProductTourStepStart ({ptContext.currentStep})
      </LText>
      <TouchableOpacity onPress={() => goTo()}>
        <LText>Continue</LText>
      </TouchableOpacity>
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

export default ProductTourStepStart;
