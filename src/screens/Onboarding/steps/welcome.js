// @flow

import React, { Component } from "react";
import { StyleSheet, View, Linking, Image } from "react-native";
import { Trans } from "react-i18next";

import { compose } from "redux";
import { TrackScreen } from "../../../analytics";
import Touchable from "../../../components/Touchable";
import LText from "../../../components/LText";
import Button from "../../../components/Button";
import OnboardingLayout from "../OnboardingLayout";
import { withOnboardingContext } from "../onboardingContext";
import IconArrowRight from "../../../icons/ArrowRight";
import { urls } from "../../../config/urls";
import { deviceNames } from "../../../wording";
import PoweredByLedger from "../../Settings/PoweredByLedger";
import type { OnboardingStepProps } from "../types";
import { withTheme } from "../../../colors";

const logo = <Image source={require("../../../images/logo.png")} />;

const hitSlop = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

type Props = OnboardingStepProps & {
  onWelcomed: () => void,
  colors: *,
};

class OnboardingStepWelcome extends Component<Props> {
  buy = () => Linking.openURL(urls.buyNanoX);

  Footer = () => <PoweredByLedger hideTabNavigation />;

  render() {
    const { onWelcomed, colors } = this.props;
    return (
      <OnboardingLayout isCentered borderedFooter={false} Footer={this.Footer}>
        <TrackScreen category="Onboarding" name="Welcome" />
        <View style={styles.logo}>{logo}</View>
        <LText style={styles.title} secondary semiBold>
          <Trans i18nKey="onboarding.stepWelcome.title" />
        </LText>
        <LText style={styles.subTitle} color="grey">
          <Trans i18nKey="onboarding.stepWelcome.desc" />
        </LText>
        <Button
          event="OnboardingWelcomeContinue"
          type="primary"
          title={<Trans i18nKey="onboarding.stepWelcome.start" />}
          onPress={onWelcomed}
        />
        <View style={styles.sub}>
          <LText style={styles.subText} color="grey">
            <Trans i18nKey="onboarding.stepWelcome.noDevice" />
          </LText>
          <Touchable
            event="WelcomeBuy"
            onPress={this.buy}
            style={styles.buyTouch}
            hitSlop={hitSlop}
          >
            <LText semiBold style={[styles.subText, styles.buy]} color="live">
              <Trans
                i18nKey="onboarding.stepWelcome.buy"
                values={deviceNames.nanoX}
              />
            </LText>
            <IconArrowRight size={16} color={colors.live} />
          </Touchable>
        </View>
      </OnboardingLayout>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 14,
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
  },
  buy: {
    marginLeft: 5,
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

export default compose(withOnboardingContext, withTheme)(OnboardingStepWelcome);
