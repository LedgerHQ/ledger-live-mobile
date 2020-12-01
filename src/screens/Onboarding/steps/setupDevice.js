// @flow

import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Trans } from "react-i18next";
import { TrackScreen } from "../../../analytics";
import colors from "../../../colors";
import type { OnboardingScene } from "../../../components/OnboardingStepperView";
import OnboardingStepperView from "../../../components/OnboardingStepperView";
import Clock from "../../../icons/Clock";
import Edit from "../../../icons/Edit";
import Warning from "../../../icons/Warning";

import setupDeviceStartImage from "../assets/setupDeviceStart.png";
import setupDeviceImage from "../assets/setupDevice.png";
import pinCodeImage from "../assets/pinCode.png";
import onboardingQuizImage from "../assets/onboardingQuiz.png";
import Check from "../../../icons/Check";
import Close from "../../../icons/Close";
import ArrowRight from "../../../icons/ArrowRight";
import LText from "../../../components/LText";

const pinCodeInfoModalProps = [
  {
    title: (
      <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.infoModal.title" />
    ),
    bullets: [
      {
        Icon: Check,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.0.label" />
        ),
        color: colors.success,
      },
      {
        Icon: Check,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.1.label" />
        ),
        color: colors.success,
      },
      {
        Icon: Check,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.2.label" />
        ),
        color: colors.success,
      },
      {
        Icon: Check,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.3.label" />
        ),
        color: colors.success,
      },
      {
        Icon: Check,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.4.label" />
        ),
        color: colors.success,
      },
      {
        Icon: Close,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.5.label" />
        ),
        color: colors.alert,
      },
      {
        Icon: Close,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.6.label" />
        ),
        color: colors.alert,
      },
      {
        Icon: Close,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.7.label" />
        ),
        color: colors.alert,
      },
    ],
  },
];

const recoveryPhraseInfoModalProps = [
  {
    title: (
      <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.title" />
    ),
    desc: (
      <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.desc" />
    ),
  },
  {
    desc: (
      <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.desc_1" />
    ),
    link: {
      label: (
        <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.link" />
      ),
      url: "",
    },
  },
  {
    title: (
      <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.title_1" />
    ),
    bullets: [
      {
        Icon: ArrowRight,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.bullets.0.label" />
        ),
      },
      {
        Icon: ArrowRight,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.bullets.1.label" />
        ),
      },
      {
        Icon: ArrowRight,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.bullets.2.label" />
        ),
      },
    ],
  },
];

const hideRecoveryPhraseInfoModalProps = [
  {
    title: (
      <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.title" />
    ),
    bullets: [
      {
        Icon: ArrowRight,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.0.label" />
        ),
      },
      {
        Icon: ArrowRight,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.1.label">
            {""}
            <LText bold>{""}</LText>
            {""}
          </Trans>
        ),
      },
      {
        Icon: ArrowRight,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.2.label">
            {""}
            <LText bold>{""}</LText>
            {""}
          </Trans>
        ),
      },
      {
        Icon: ArrowRight,
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.2.label" />
        ),
      },
    ],
  },
];

const scenes: OnboardingScene[] = [
  {
    sceneProps: {
      image: setupDeviceStartImage,
      title: <Trans i18nKey="onboarding.stepSetupDevice.start.title" />,
      bullets: [
        {
          Icon: Clock,
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.start.bullets.0.label" />
          ),
        },
        {
          Icon: Edit,
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.start.bullets.1.label" />
          ),
        },
        {
          Icon: Clock,
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.start.bullets.2.label" />
          ),
        },
      ],
      ctaText: <Trans i18nKey="onboarding.stepSetupDevice.start.cta" />,
      ctaWarningModal: {
        Icon: Warning,
        title: (
          <Trans i18nKey="onboarding.stepSetupDevice.start.warning.title" />
        ),
        desc: <Trans i18nKey="onboarding.stepSetupDevice.start.warning.desc" />,
        ctaText: (
          <Trans i18nKey="onboarding.stepSetupDevice.start.warning.ctaText" />
        ),
      },
    },
    type: "primary",
    id: "start",
  },
  {
    sceneProps: {
      image: setupDeviceImage,
      bullets: [
        {
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.setup.bullets.0.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.setup.bullets.0.label" />
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.setup.bullets.1.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.setup.bullets.1.label" />
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.setup.bullets.2.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.setup.bullets.2.label" />
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.setup.bullets.3.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.setup.bullets.3.label" />
          ),
        },
      ],
      ctaText: <Trans i18nKey="onboarding.stepSetupDevice.setup.cta" />,
    },
    type: "secondary",
    id: "setup",
  },
  {
    sceneProps: {
      image: pinCodeImage,
      title: <Trans i18nKey="onboarding.stepSetupDevice.pinCode.title" />,
      desc: <Trans i18nKey="onboarding.stepSetupDevice.pinCode.desc" />,
      ctaText: <Trans i18nKey="onboarding.stepSetupDevice.pinCode.cta" />,
      ctaWarningCheckbox: {
        desc: (
          <Trans i18nKey="onboarding.stepSetupDevice.pinCode.checkboxDesc" />
        ),
      },
    },
    sceneInfoModalProps: pinCodeInfoModalProps,
    type: "primary",
    id: "pinCode",
  },
  {
    sceneProps: {
      image: pinCodeImage,
      bullets: [
        {
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.bullets.0.title" />
          ),
          label: (
            <>
              <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.bullets.0.label_0" />
              <Check size={10} color={colors.live} />
              <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.bullets.0.label_1" />
              <Check size={10} color={colors.live} />
              <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.bullets.0.label_2" />
            </>
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.bullets.1.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.bullets.1.label" />
          ),
        },
      ],
      ctaText: <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.cta" />,
    },
    sceneInfoModalProps: pinCodeInfoModalProps,
    type: "secondary",
    id: "pinCodeSetup",
  },
  {
    sceneProps: {
      image: pinCodeImage,
      title: (
        <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhrase.title" />
      ),
      desc: <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhrase.desc" />,
      ctaText: (
        <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhrase.cta" />
      ),
      ctaWarningCheckbox: {
        desc: (
          <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhrase.checkboxDesc" />
        ),
      },
    },
    sceneInfoModalProps: recoveryPhraseInfoModalProps,
    type: "primary",
    id: "recoveryPhrase",
  },
  {
    sceneProps: {
      image: pinCodeImage,
      bullets: [
        {
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.0.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.0.label" />
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.1.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.1.label" />
          ),
        },
      ],
      ctaText: (
        <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.cta" />
      ),
    },
    sceneInfoModalProps: recoveryPhraseInfoModalProps,
    type: "secondary",
    id: "recoveryPhraseSetup",
  },
  {
    sceneProps: {
      image: pinCodeImage,
      bullets: [
        {
          index: 3,
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.2.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.2.label" />
          ),
        },
        {
          index: 4,
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.3.title" />
          ),
          label: "",
        },
      ],
      ctaText: (
        <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhraseSetup.nextStep" />
      ),
    },
    sceneInfoModalProps: recoveryPhraseInfoModalProps,
    type: "secondary",
    id: "recoveryPhraseSetup_1",
  },
  {
    sceneProps: {
      title: (
        <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.title" />
      ),
      desc: (
        <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.desc" />
      ),
      bullets: [
        {
          Icon: Check,
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.bullets.0.label" />
          ),
        },
        {
          Icon: Check,
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.bullets.1.label" />
          ),
        },
      ],
      infoModalLink: {
        label: (
          <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.label" />
        ),
      },
      ctaText: (
        <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.cta" />
      ),
      ctaWarningModal: {
        image: onboardingQuizImage,
        title: (
          <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.warning.title" />
        ),
        desc: (
          <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.warning.desc" />
        ),
        ctaText: (
          <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.warning.cta" />
        ),
      },
    },
    sceneInfoModalProps: hideRecoveryPhraseInfoModalProps,
    type: "primary",
    id: "hideRecoveryPhrase",
  },
];

function OnboardingStepNewDevice({ navigation, route }: *) {
  const next = useCallback(() => {}, []);

  return (
    <OnboardingStepperView
      scenes={scenes}
      navigation={navigation}
      route={route}
      onFinish={next}
    />
  );
}

export default OnboardingStepNewDevice;
