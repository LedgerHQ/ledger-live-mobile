// @flow
import React from "react";
import { Trans } from "react-i18next";
import SafeAreaView from "react-native-safe-area-view";
import { Image, StyleSheet, View } from "react-native";
import Button from "../../components/Button";
import LText from "../../components/LText";
import swapIllustration from "../../images/swap.png";
import colors from "../../colors";

const Landing = ({ onContinue }: { onContinue: any }) => {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.wrapper}>
        <Image source={swapIllustration} style={styles.illustration} />
        <LText secondary style={styles.title}>
          <Trans i18nKey="transfer.swap.landing.title" />
        </LText>
        <LText primary style={styles.disclaimer}>
          <Trans i18nKey="transfer.swap.landing.disclaimer" />
        </LText>
      </View>
      <Button
        event="ConfirmSwapLandingDisclaimer"
        type={"primary"}
        title={<Trans i18nKey="common.continue" />}
        onPress={onContinue}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },

  wrapper: {
    flexGrow: 1,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  illustration: {
    width: 238,
    height: 128,
    marginBottom: 40,
  },

  title: {
    fontSize: 18,
    color: colors.darkBlue,
    marginBottom: 8,
  },

  disclaimer: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.smoke,
    textAlign: "center",
  },
});

export default Landing;
