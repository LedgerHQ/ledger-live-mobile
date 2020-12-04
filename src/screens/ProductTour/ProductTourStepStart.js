// @flow

import React, { useContext } from "react";
import { Trans } from "react-i18next";
import _ from "lodash";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import LText from "../../components/LText";
import colors from "../../colors";
import { context } from "./Provider";
import { NavigatorName } from "../../const";
import { navigate } from "../../rootnavigation";

type Props = {
  navigation: any,
};

const ProductTourStepStart = ({ navigation }: Props) => {
  const ptContext = useContext(context);

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
