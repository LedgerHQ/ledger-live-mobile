// @flow

import React, { Component, PureComponent } from "react";
import { BackHandler, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TrackScreen } from "../../../analytics";
import LText from "../../../components/LText";
import Touchable from "../../../components/Touchable";
import OnboardingLayout from "../OnboardingLayout";
import { withOnboardingContext } from "../onboardingContext";
import NanoSVertical from "../../../icons/NanoSVertical";
import NanoXVertical from "../../../icons/NanoXVertical";
import Blue from "../../../icons/Blue";
import colors from "../../../colors";
import { deviceNames } from "../../../wording";

import type { OnboardingStepProps } from "../types";
import OnboardingStepWelcome from "./welcome";
import Circle from "../../../components/Circle";
import Close from "../../../icons/Close";
import { hasCompletedOnboardingSelector } from "../../../reducers/settings";

function CloseOnboarding() {
  const { navigate } = useNavigation();
  const route = useRoute();

  return (
    <Touchable
      event="OnboardingClose"
      style={styles.close}
      onPress={() => {
        navigate(route.params?.goingBackToScreen);
      }}
    >
      <Circle size={28} bg={colors.lightFog}>
        <Close size={14} color={colors.grey} />
      </Circle>
    </Touchable>
  );
}

class OnboardingStepChooseDevice extends Component<
  OnboardingStepProps & {
    hasCompletedOnboarding: boolean,
  },
> {
  componentDidMount() {
    if (this.props.route.params?.autoJumpToNanoX) this.chooseNanoX();

    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton = () => {
    const { navigation, hasCompletedOnboarding } = this.props;
    if (hasCompletedOnboarding) {
      const { goingBackToScreen } = this.props.route.params || {};
      navigation.navigate(goingBackToScreen);
      return true;
    }
    return false;
  };

  onWelcome = () => this.props.setShowWelcome(false);
  chooseNanoX = async () => {
    await this.props.setOnboardingDeviceModel("nanoX");
    this.props.next();
  };
  chooseNanoS = async () => {
    await this.props.setOnboardingDeviceModel("nanoS");
    this.props.next();
  };
  chooseBlue = async () => {
    await this.props.setOnboardingDeviceModel("blue");
    this.props.next();
  };

  render() {
    const { hasCompletedOnboarding, showWelcome } = this.props;

    if (showWelcome) {
      return (
        <OnboardingStepWelcome {...this.props} onWelcomed={this.onWelcome} />
      );
    }

    return (
      <OnboardingLayout isFull>
        <TrackScreen category="Onboarding" name="Device" />
        {hasCompletedOnboarding ? <CloseOnboarding /> : null}
        <LText secondary semiBold style={styles.title}>
          <Trans i18nKey="onboarding.stepsTitles.OnboardingStepChooseDevice" />
        </LText>

        <DeviceItem
          event="OnboardingDevice"
          eventProperties={{ product: "NanoX" }}
          title={deviceNames.nanoX.fullDeviceName}
          onPress={this.chooseNanoX}
          Icon={NanoXVertical}
        />
        <DeviceItem
          event="OnboardingDevice"
          eventProperties={{ product: "NanoS" }}
          title={deviceNames.nanoS.fullDeviceName}
          onPress={this.chooseNanoS}
          Icon={NanoSVertical}
        />
        <DeviceItem
          event="OnboardingDevice"
          eventProperties={{ product: "Blue" }}
          title={deviceNames.blue.fullDeviceName}
          onPress={this.chooseBlue}
          Icon={Blue}
        />
      </OnboardingLayout>
    );
  }
}

type DeviceItemProps = {
  title: string,
  desc?: React$Element<*>,
  onPress: () => *,
  Icon: React$ComponentType<*>,
  event: *,
  eventProperties: *,
};

class DeviceItem extends PureComponent<DeviceItemProps> {
  render() {
    const { title, desc, onPress, Icon, event, eventProperties } = this.props;
    return (
      <Touchable
        onPress={onPress}
        style={styles.deviceItem}
        event={event}
        eventProperties={eventProperties}
      >
        <Icon />
        <LText semiBold style={styles.deviceTitle}>
          {title}
        </LText>
        {desc && <LText style={styles.deviceDesc}>{desc}</LText>}
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: colors.darkBlue,
    fontSize: 24,
    lineHeight: 36,
    margin: 16,
    marginLeft: 0,
  },
  deviceItem: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.fog,
    marginBottom: 8,
    borderRadius: 4,
  },
  close: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  deviceTitle: {
    marginTop: 16,
    fontSize: 16,
    color: colors.darkBlue,
  },
  deviceDesc: {
    marginTop: 8,
    fontSize: 14,
    color: colors.grey,
  },
});

export default connect(
  createStructuredSelector({
    hasCompletedOnboarding: hasCompletedOnboardingSelector,
  }),
)(withOnboardingContext(OnboardingStepChooseDevice));
