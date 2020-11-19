// @flow

import React, { useCallback } from "react";
import { StyleSheet, View, Linking, Image, SafeAreaView } from "react-native";
import { Trans } from "react-i18next";

import { TrackScreen } from "../../../analytics";
import Touchable from "../../../components/Touchable";
import LText from "../../../components/LText";
import Button from "../../../components/Button";
import IconArrowRight from "../../../icons/ArrowRight";
import colors from "../../../colors";
import { urls } from "../../../config/urls";
import { deviceNames } from "../../../wording";

const logo = <Image source={require("../../../images/logo.png")} />;

const hitSlop = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

function OnboardingStepWelcome() {
  const buy = useCallback(() => Linking.openURL(urls.buyNanoX), []);
  const next = useCallback(() => {}, []);

  return (
    <SafeAreaView>
      <TrackScreen category="Onboarding" name="Welcome" />
      <View style={styles.logo}>{logo}</View>
      <LText style={styles.title} secondary semiBold>
        <Trans i18nKey="onboarding.stepWelcome.title" />
      </LText>
      <LText style={styles.subTitle}>
        <Trans i18nKey="onboarding.stepWelcome.desc" />
      </LText>
      <Button
        event="OnboardingWelcomeContinue"
        type="primary"
        title={<Trans i18nKey="onboarding.stepWelcome.start" />}
        onPress={next}
      />
      <View style={styles.sub}>
        <LText style={styles.subText}>
          <Trans i18nKey="onboarding.stepWelcome.noDevice" />
        </LText>
        <Touchable
          event="WelcomeBuy"
          onPress={buy}
          style={styles.buyTouch}
          hitSlop={hitSlop}
        >
          <LText semiBold style={[styles.subText, styles.buy]}>
            <Trans
              i18nKey="onboarding.stepWelcome.buy"
              values={deviceNames.nanoX}
            />
          </LText>
          <IconArrowRight size={16} color={colors.live} />
        </Touchable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.darkBlue,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 14,
    color: colors.grey,
    textAlign: "center",
    marginBottom: 32,
  },
  sub: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  subText: {
    fontSize: 14,
    color: colors.grey,
  },
  footer: {},
  buy: {
    marginLeft: 5,
    color: colors.live,
  },
  buyTouch: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    alignItems: "center",
    marginBottom: 16,
  },
});

export default OnboardingStepWelcome;
