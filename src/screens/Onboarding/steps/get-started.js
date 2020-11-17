// @flow
import React, { Component, PureComponent } from "react";
import { StyleSheet, View, Linking, Platform } from "react-native";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import Icon from "react-native-vector-icons/dist/Feather";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome";
import { getDeviceModel } from "@ledgerhq/devices";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { hasCompletedOnboardingSelector } from "../../../reducers/settings";

import type { OnboardingStepProps } from "../types";
import { TrackScreen } from "../../../analytics";
import OnboardingLayout from "../OnboardingLayout";
import LText from "../../../components/LText";
import Touchable from "../../../components/Touchable";
import { withOnboardingContext } from "../onboardingContext";
import IconImport from "../../../icons/Import";
import IconCheck from "../../../icons/Check";
import IconRestore from "../../../icons/History";
import { urls } from "../../../config/urls";
import UpgradeToNanoXBanner from "../../../components/UpgradeToNanoXBanner";
import StepLegacyModal from "../../../modals/StepLegacyModal";
import { withTheme } from "../../../colors";

type Props = OnboardingStepProps & {
  hasCompletedOnboarding: boolean,
  colors: *,
};

const mapStateToProps = createStructuredSelector({
  hasCompletedOnboarding: hasCompletedOnboardingSelector,
});

class OnboardingStepGetStarted extends Component<Props, *> {
  state = {
    modalVisible: false,
  };

  onImport = async () => {
    await this.props.setOnboardingMode("qr");
    this.props.next();
  };

  onInitialized = async () => {
    await this.props.setOnboardingMode("alreadyInitialized");
    this.props.next();
  };

  onInit = async () => {
    await this.props.setOnboardingMode("full");
    this.props.next();
  };

  onRestore = async () => {
    await this.props.setOnboardingMode("restore");
    this.props.next();
  };

  onBuy = () => Linking.openURL(urls.buyNanoX);

  Footer = () => <UpgradeToNanoXBanner action={this.onBuy} />;

  enableModal = () => {
    this.setState({ modalVisible: true });
  };

  quitModal = () => {
    this.setState({ modalVisible: false });
  };

  IconPlus = () => (
    <Icon name="plus" color={this.props.colors.live} size={16} />
  );

  render() {
    const { modalVisible } = this.state;
    const { deviceModelId, hasCompletedOnboarding, colors } = this.props;
    const deviceModel = getDeviceModel(deviceModelId);
    const title = deviceModel.productName;
    const showAd = deviceModelId !== "nanoX";

    return (
      <OnboardingLayout
        header="OnboardingStepGetStarted"
        Footer={showAd ? this.Footer : undefined}
        titleOverride={title}
      >
        <TrackScreen category="Onboarding" name="GetStarted" />
        {!hasCompletedOnboarding || deviceModelId !== "nanoX" ? (
          <Row
            id="import"
            Icon={IconImport}
            label={<Trans i18nKey="onboarding.stepGetStarted.import" />}
            onPress={this.onImport}
            colors={colors}
          />
        ) : null}
        {deviceModelId === "nanoX" || Platform.OS === "android" ? (
          <>
            <Row
              id="initialize"
              Icon={this.IconPlus}
              label={<Trans i18nKey="onboarding.stepGetStarted.initialize" />}
              onPress={this.onInit}
              colors={colors}
            />
            <Row
              id="restore"
              Icon={IconRestore}
              label={<Trans i18nKey="onboarding.stepGetStarted.restore" />}
              onPress={this.onRestore}
              colors={colors}
            />
            <Row
              id="initialized"
              Icon={IconCheck}
              label={<Trans i18nKey="onboarding.stepGetStarted.initialized" />}
              onPress={this.onInitialized}
              colors={colors}
            />
          </>
        ) : (
          <Touchable event="StepLegacyOpenModal" onPress={this.enableModal}>
            <LText style={styles.description} color="smoke">
              <Trans i18nKey="onboarding.stepLegacy.description" />{" "}
              <FontAwesome name="info-circle" size={14} color={colors.fog} />
            </LText>
          </Touchable>
        )}
        <StepLegacyModal isOpened={modalVisible} onClose={this.quitModal} />
      </OnboardingLayout>
    );
  }
}

type RowProps = {
  Icon: React$ComponentType<*>,
  label: string | React$Element<*>,
  onPress: () => any,
  id: string,
  colors: *,
};

class Row extends PureComponent<RowProps> {
  render() {
    const { onPress, label, Icon, id, colors } = this.props;
    return (
      <Touchable
        event="OnboardingGetStartedChoice"
        eventProperties={{ id }}
        onPress={onPress}
        style={[styles.row, { borderColor: colors.fog }]}
      >
        <View style={styles.rowIcon}>
          {Icon ? <Icon size={16} color={colors.live} /> : null}
        </View>
        <LText style={styles.label} semiBold>
          {label}
        </LText>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginVertical: 32,
  },
  extraMargin: {
    marginTop: 32,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  rowIcon: {
    width: 16,
    marginRight: 16,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  description: {
    marginTop: 40,
    padding: 16,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});

export default compose(
  connect(mapStateToProps),
  withOnboardingContext,
  withTheme,
)(OnboardingStepGetStarted);
