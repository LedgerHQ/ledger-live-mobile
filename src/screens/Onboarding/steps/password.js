// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { View, StyleSheet, Image } from "react-native";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { TrackScreen } from "../../../analytics";
import { NavigatorName } from "../../../const";
import type { Privacy } from "../../../reducers/settings";
import { privacySelector } from "../../../reducers/settings";
import LText from "../../../components/LText";
import Button from "../../../components/Button";
import BiometricsIcon from "../../../components/BiometricsIcon";
import BiometricsRow from "../../Settings/General/BiometricsRow";
import OnboardingLayout from "../OnboardingLayout";
import { withOnboardingContext } from "../onboardingContext";
import type { OnboardingStepProps } from "../types";
import PasslockDisclaimerModal from "../../../modals/PasslockDisclaimerModal";
import { withTheme } from "../../../colors";

const illustration = (
  <Image source={require("../assets/password-illustration.png")} />
);

export const Success = () => (
  <View style={styles.success}>
    <Image source={require("../assets/success.png")} />
  </View>
);

class OnboardingStepPassword extends Component<
  OnboardingStepProps & {
    privacy: ?Privacy,
    colors: *,
  },
  { isModalOpened: boolean },
> {
  state = {
    isModalOpened: false,
  };

  showModal = () => {
    this.setState({ isModalOpened: true });
  };

  hideModal = () => {
    this.setState({ isModalOpened: false });
  };

  navigateToPassword = () => {
    this.props.navigation.navigate(NavigatorName.PasswordAddFlow);
  };

  Footer = () => {
    const { privacy } = this.props;

    return privacy ? (
      <Button
        event="OnboardingPasswordContinue"
        type="primary"
        title={<Trans i18nKey="common.continue" />}
        onPress={this.showModal}
      />
    ) : (
      <Button
        event="OnboardingPasswordSetup"
        type="primary"
        title={<Trans i18nKey="onboarding.stepPassword.setPassword" />}
        onPress={this.navigateToPassword}
      />
    );
  };

  render() {
    const { privacy, next, colors } = this.props;
    const { isModalOpened } = this.state;

    return (
      <OnboardingLayout
        header="OnboardingStepPassword"
        Footer={this.Footer}
        withSkip={!privacy}
      >
        <TrackScreen category="Onboarding" name="Password" />
        <PasslockDisclaimerModal
          isOpened={isModalOpened}
          onAccept={next}
          onClose={this.hideModal}
        />
        <View style={styles.hero}>
          {illustration}
          {privacy ? <Success /> : null}
        </View>
        <LText style={styles.desc} color="smoke">
          <Trans
            i18nKey={
              privacy
                ? "onboarding.stepPassword.descConfigured"
                : "onboarding.stepPassword.desc"
            }
          />
        </LText>
        {privacy && privacy.biometricsType ? (
          <View style={[styles.box, { borderColor: colors.lightFog }]}>
            <BiometricsRow
              iconLeft={
                <BiometricsIcon
                  biometricsType={privacy.biometricsType}
                  size={40}
                  color={colors.live}
                />
              }
            />
          </View>
        ) : null}
      </OnboardingLayout>
    );
  }
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 16,
    paddingBottom: 16, // less padding because shadow of the logo
    alignSelf: "center",
  },
  success: {
    position: "absolute",
    top: 16,
    right: 2,
  },
  desc: {
    textAlign: "center",

    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  box: {
    borderWidth: 1,
    borderRadius: 4,
  },
});

export default compose(
  withOnboardingContext,
  connect(
    createStructuredSelector({
      privacy: privacySelector,
    }),
  ),
  withTheme,
)(OnboardingStepPassword);
