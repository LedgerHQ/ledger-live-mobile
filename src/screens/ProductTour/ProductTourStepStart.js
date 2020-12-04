// @flow

import React, { useContext } from "react";
import { Trans } from "react-i18next";
import _ from "lodash";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import LText from "../../components/LText";
import Button from "../../components/Button";
import colors from "../../colors";
import { context } from "./Provider";
import { NavigatorName } from "../../const";
import { navigate } from "../../rootnavigation";
import ArrowRight from "../../icons/ArrowRight";

const forceInset = { bottom: "always" };

const stepTitles = {
  INSTALL_CRYPTO: [
    "producttour.stepstart.installcrypto",
    "producttour.stepstart.installcryptodetails",
  ],
  CREATE_ACCOUNT: [
    "producttour.stepstart.createaccount",
    "producttour.stepstart.createaccountdetails",
  ],
  RECEIVE_COINS: [
    "producttour.stepstart.receivecoins",
    "producttour.stepstart.receivecoinsdetails",
  ],
  /*
  "BUY_COINS": ["CREATE_ACCOUNT"],
  "SEND_COINS": ["CREATE_ACCOUNT"],
  "SWAP_COINS": ["RECEIVE_COINS"],
  CUSTOMIZE_APP: [],
  */
};

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
    <SafeAreaView style={styles.root}>
      <View style={{ flex: 1 }}>
        <Image
          source={require("../../images/stepstartcastle.png")}
          style={styles.image}
        />
        <LText style={styles.title} bold>
          <Trans i18nKey={stepTitles[ptContext.currentStep][0]} />
        </LText>
        <LText style={styles.details}>
          <Trans i18nKey={stepTitles[ptContext.currentStep][1]} />
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
    alignSelf: "flex-end",
    height: 177,
    width: 320,
    marginBottom: 21,
    position: "relative",
    right: -16,
  },
});

export default ProductTourStepStart;
