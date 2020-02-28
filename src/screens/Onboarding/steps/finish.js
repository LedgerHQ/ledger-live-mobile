// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { Image, View, StyleSheet } from "react-native";
import { createStructuredSelector } from "reselect";

import { TrackScreen } from "../../../analytics";
import { completeOnboarding } from "../../../actions/settings";
import { NavigatorName } from "../../../const";
import LText from "../../../components/LText";
import Button from "../../../components/Button";
import OnboardingLayout from "../OnboardingLayout";
import ConfettiParty from "../../../components/ConfettiParty";
import { withOnboardingContext } from "../onboardingContext";
import colors from "../../../colors";

import type { OnboardingStepProps } from "../types";
import { readOnlyModeEnabledSelector } from "../../../reducers/settings";

type Props = OnboardingStepProps & {
  completeOnboarding: () => void,
  readOnlyModeEnabled: boolean,
};

const mapDispatchToProps = {
  completeOnboarding,
};

const mapStateToProps = createStructuredSelector({
  readOnlyModeEnabled: readOnlyModeEnabledSelector,
});
const logo = <Image source={require("../../../images/logo.png")} />;

class OnboardingStepFinish extends Component<Props> {
  onFinish = () => {
    this.props.completeOnboarding();
    this.props.resetCurrentStep();
  };

  render() {
    const { readOnlyModeEnabled } = this.props;
    return (
      <View style={styles.wrapper}>
        <TrackScreen category="Onboarding" name="Finish" />
        <View style={styles.confettiContainer} pointerEvents="none">
          <ConfettiParty />
        </View>
        <OnboardingLayout isCentered style={styles.onboardingLayout}>
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
              onPress={this.onFinish}
            />
          </View>
        </OnboardingLayout>
      </View>
    );
  }
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
  wrapper: { flex: 1, backgroundColor: "white" },
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

export default withOnboardingContext(
  connect(mapStateToProps, mapDispatchToProps)(OnboardingStepFinish),
);
