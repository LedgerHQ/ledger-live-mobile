// @flow

import React from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Image, View, StyleSheet, SafeAreaView } from "react-native";

import { TrackScreen } from "../../../analytics";
import { completeOnboarding } from "../../../actions/settings";
import LText from "../../../components/LText";
import Button from "../../../components/Button";
import ConfettiParty from "../../../components/ConfettiParty";
import { useNavigationInterceptor } from "../onboardingContext";
import colors from "../../../colors";
import { NavigatorName } from "../../../const";

import { readOnlyModeEnabledSelector } from "../../../reducers/settings";

const logo = <Image source={require("../../../images/logo.png")} />;

type Props = {
  navigation: any,
};

export default function OnboardingStepFinish({ navigation }: Props) {
  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);
  const dispatch = useDispatch();
  const { resetCurrentStep } = useNavigationInterceptor();

  function onFinish(): void {
    dispatch(completeOnboarding());
    resetCurrentStep();

    const parentNav = navigation.dangerouslyGetParent();
    if (parentNav) {
      parentNav.popToTop();
    }

    navigation.navigate(NavigatorName.Base, {
      screen: NavigatorName.Main,
    });
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <TrackScreen category="Onboarding" name="Finish" />
      <View style={styles.confettiContainer} pointerEvents="none">
        <ConfettiParty />
      </View>
      <View style={styles.hero}>{logo}</View>
      <LText style={styles.title} secondary semiBold>
        <Trans
          i18nKey={
            readOnlyModeEnabled
              ? "onboarding.stepFinish.readOnlyTitle"
              : "onboarding.stepFinish.title"
          }
        />
      </LText>
      {!readOnlyModeEnabled && (
        <LText style={styles.desc}>
          <Trans i18nKey="onboarding.stepFinish.desc" />
        </LText>
      )}
      <View style={styles.buttonWrapper}>
        <Button
          event="OnboardingFinish"
          type="primary"
          containerStyle={styles.buttonContainer}
          title={<Trans i18nKey="onboarding.stepFinish.cta" />}
          onPress={onFinish}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
  },
  onboardingLayout: { backgroundColor: "transparent" },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  wrapper: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  buttonContainer: {
    flexGrow: 1,
  },
  buttonWrapper: {
    flexDirection: "row",
    width: "100%",
  },
  title: {
    marginTop: 24,
    marginBottom: 16,
    textAlign: "center",
    color: colors.darkBlue,
    fontSize: 16,
  },
  desc: {
    textAlign: "center",
    color: colors.grey,
    fontSize: 14,
    marginBottom: 32,
  },
});
