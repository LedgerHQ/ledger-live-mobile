// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";

import SelectDevice from "../../../components/SelectDevice";
import {
  connectingStep,
  dashboard,
  genuineCheck,
} from "../../../components/DeviceJob/steps";
import LText from "../../../components/LText";
import IconExternalLink from "../../../icons/ExternalLink";
import OnboardingLayout from "../OnboardingLayout";
import { withOnboardingContext } from "../onboardingContext";
import colors from "../../../colors";
import { urls } from "../../../config/urls";

import type { OnboardingStepProps } from "../types";

const hitSlop = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

class OnboardingStepPairNew extends Component<OnboardingStepProps> {
  Footer = () => (
    <TouchableOpacity
      style={styles.footer}
      hitSlop={hitSlop}
      onPress={this.help}
    >
      <LText style={styles.footerText} semiBold>
        <Trans i18nKey="common.needHelp" />
      </LText>
      <IconExternalLink size={16} color={colors.live} />
    </TouchableOpacity>
  );

  help = () => Linking.openURL(urls.faq);

  pairNew = () => this.props.navigation.navigate("PairDevices");

  render() {
    const { next } = this.props;
    return (
      <OnboardingLayout
        header="OnboardingStepPairNew"
        Footer={this.Footer}
        borderedFooter
        noHorizontalPadding
        noTopPadding
      >
        <SelectDevice
          onSelect={next}
          steps={[connectingStep, dashboard, genuineCheck]}
        />
      </OnboardingLayout>
    );
  }
}

const styles = StyleSheet.create({
  hero: {
    paddingVertical: 24,
    alignItems: "center",
  },
  desc: {
    textAlign: "center",
    lineHeight: 21,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  cta: {
    borderWidth: 1,
    borderColor: colors.fog,
    padding: 16,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  ctaText: {
    marginLeft: 16,
    color: colors.live,
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  footerText: {
    color: colors.live,
    marginRight: 8,
  },
});

export default withOnboardingContext(OnboardingStepPairNew);
