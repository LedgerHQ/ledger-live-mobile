// @flow
import React from "react";
import { Platform } from "react-native";
import { Trans } from "react-i18next";
import colors from "../../../colors";
import type { OnboardingScene } from "../../../components/OnboardingStepperView";

import setupDeviceStartImage from "../assets/getStarted.png";
import setupDeviceNanoX from "../assets/setupDeviceNanoX.png";
import pinCodeImage from "../assets/pinCodeImage.png";
import pinCodeNanoX from "../assets/pinCodeNanoX.png";
import recoveryPhrase from "../assets/recoveryPhrase.png";
import recoverySheet from "../assets/recoverySheet.png";
import hideRecoveryPhrase from "../assets/hideRecoveryPhrase.png";
import enterWordsNanoX from "../assets/enterWordsNanoX.png";
import importRecoveryPhrase from "../assets/importRecoveryPhrase.png";
import syncCryptos from "../assets/syncCryptos.png";

import onboardingQuizImage from "../assets/onboardingQuiz.png";

import Clock from "../../../icons/Clock";
import Edit from "../../../icons/Edit";
import Check from "../../../icons/Check";
import Warning from "../../../icons/Warning";
import EyeCrossed from "../../../icons/EyeCrossed";
import Close from "../../../icons/Close";
import Flower from "../../../icons/Flower";
import ArrowRight from "../../../icons/ArrowRight";
import LText from "../../../components/LText";
import NanoDeviceCancelIcon from "../../../icons/NanoDeviceCancelIcon";
import NanoDeviceCheckIcon from "../../../icons/NanoDeviceCheckIcon";

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
      url: "", // @TODO correct url here
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
          <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.3.label" />
        ),
      },
    ],
  },
];

export const pairNewErrorInfoModalProps = [
  {
    title: <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.title" />,
    desc: <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.desc" />,
  },
  {
    desc: <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.desc_1" />,
  },
  {
    desc: <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.desc_2" />,
    link: {
      label: <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.link" />,
      url: "", // @TODO correct url here
    },
  },
  ...(Platform.OS === "android"
    ? [
        {
          title: (
            <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.title_1" />
          ),
          desc: (
            <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.desc_3" />
          ),
        },
        {
          desc: (
            <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.desc_4" />
          ),
          bullets: [
            {
              Icon: ArrowRight,
              label: (
                <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.bullets.0.label" />
              ),
            },
            {
              Icon: ArrowRight,
              label: (
                <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.bullets.1.label" />
              ),
            },
            {
              Icon: ArrowRight,
              label: (
                <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.bullets.2.label" />
              ),
            },
            {
              Icon: ArrowRight,
              label: (
                <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.bullets.3.label" />
              ),
            },
          ],
        },
        {
          desc: (
            <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.desc_5" />
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.title_2" />
          ),
          desc: (
            <Trans i18nKey="onboarding.stepPairNew.errorInfoModal.desc_6" />
          ),
        },
      ]
    : []),
];

const pinCodeScenes = [
  {
    sceneProps: {
      image: pinCodeImage,
      title: <Trans i18nKey="onboarding.stepSetupDevice.pinCode.title" />,
      descs: [<Trans i18nKey="onboarding.stepSetupDevice.pinCode.desc" />],
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
      image: pinCodeNanoX,
      bullets: [
        {
          title: (
            <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.bullets.0.title" />
          ),
          label: (
            <>
              <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.bullets.0.label_0" />
              <NanoDeviceCheckIcon size={12} color={colors.live} />
              <Trans i18nKey="onboarding.stepSetupDevice.pinCodeSetup.bullets.0.label_1" />
              <NanoDeviceCancelIcon size={12} color={colors.live} />
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
];

const getSetupDeviceScenes: (
  deviceModelId: "nanoS" | "nanoX" | "blue",
) => OnboardingScene[] = deviceModelId => [
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
          Icon: Flower,
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
  ...(deviceModelId === "nanoX"
    ? [
        {
          sceneProps: {
            image: setupDeviceNanoX,
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
      ]
    : []),
  ...pinCodeScenes,
  {
    sceneProps: {
      image: recoveryPhrase,
      title: (
        <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhrase.title" />
      ),
      descs: [
        <Trans i18nKey="onboarding.stepSetupDevice.recoveryPhrase.desc" />,
      ],
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
      image: recoverySheet,
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
      image: enterWordsNanoX,
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
      image: hideRecoveryPhrase,
      title: (
        <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.title" />
      ),
      descs: [
        <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.desc" />,
      ],
      bullets: [
        {
          Icon: Warning,
          color: colors.alert,
          label: (
            <Trans i18nKey="onboarding.stepSetupDevice.hideRecoveryPhrase.bullets.0.label" />
          ),
        },
        {
          Icon: EyeCrossed,
          color: colors.alert,
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

const recoveryPhraseScenes = [
  {
    sceneProps: {
      image: importRecoveryPhrase,
      title: (
        <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.title" />
      ),
      descs: [
        <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.desc" />,
        <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.desc_1" />,
      ],
      ctaText: (
        <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.cta" />
      ),
      ctaWarningModal: {
        Icon: Warning,
        title: (
          <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.warning.title" />
        ),
        desc: (
          <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.warning.desc" />
        ),
        ctaText: (
          <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.warning.cta" />
        ),
      },
    },
    type: "primary",
    id: "importRecoveryPhrase",
  },
  {
    sceneProps: {
      image: enterWordsNanoX,
      bullets: [
        {
          title: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.0.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.0.label" />
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.1.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.1.label" />
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.2.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.2.label" />
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.3.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.3.label" />
          ),
        },
      ],
      ctaText: (
        <Trans i18nKey="onboarding.stepRecoveryPhrase.importRecoveryPhrase.nextStep" />
      ),
    },
    type: "secondary",
    id: "importRecoveryPhrase_1",
  },
  ...pinCodeScenes,
  {
    sceneProps: {
      image: importRecoveryPhrase,
      title: (
        <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.title" />
      ),
      descs: [
        <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.desc" />,
        <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.desc_1" />,
      ],
      ctaText: (
        <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.cta" />
      ),
      ctaWarningCheckbox: {
        desc: (
          <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.checkboxDesc" />
        ),
      },
    },
    sceneInfoModalProps: recoveryPhraseInfoModalProps,
    type: "primary",
    id: "existingRecoveryPhrase",
  },
  {
    sceneProps: {
      image: importRecoveryPhrase,
      bullets: [
        {
          title: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.0.title" />
          ),
        },
        {
          title: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.1.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.1.label" />
          ),
        },
      ],
      ctaText: (
        <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.nextStep" />
      ),
    },
    sceneInfoModalProps: recoveryPhraseInfoModalProps,
    type: "secondary",
    id: "existingRecoveryPhrase_1",
  },
  {
    sceneProps: {
      image: importRecoveryPhrase,
      bullets: [
        {
          index: 3,
          title: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.2.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.2.label" />
          ),
        },
        {
          index: 4,
          title: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.3.title" />
          ),
          label: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.3.label" />
          ),
        },
        {
          index: 5,
          title: (
            <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.4.title" />
          ),
        },
      ],
      ctaText: (
        <Trans i18nKey="onboarding.stepRecoveryPhrase.existingRecoveryPhrase.nextStep" />
      ),
    },
    sceneInfoModalProps: recoveryPhraseInfoModalProps,
    type: "secondary",
    id: "existingRecoveryPhrase_2",
  },
];

const importAccountsScenes = [
  {
    sceneProps: {
      image: syncCryptos,
      title: <Trans i18nKey="onboarding.stepImportAccounts.title" />,
      descs: [<Trans i18nKey="onboarding.stepImportAccounts.desc" />],
      ctaText: <Trans i18nKey="onboarding.stepImportAccounts.cta" />,
      bullets: [
        {
          Icon: Clock,
          label: (
            <Trans i18nKey="onboarding.stepImportAccounts.bullets.0.label">
              {""}
              <LText semiBold />
              {""}
            </Trans>
          ),
        },
        {
          Icon: Clock,
          label: (
            <Trans i18nKey="onboarding.stepImportAccounts.bullets.1.label" />
          ),
        },
        {
          Icon: Check,
          label: (
            <Trans i18nKey="onboarding.stepImportAccounts.bullets.2.title" />
          ),
        },
      ],
      ctaWarningModal: {
        Icon: Warning,
        title: <Trans i18nKey="onboarding.stepImportAccounts.warning.title" />,
        desc: <Trans i18nKey="onboarding.stepImportAccounts.warning.desc" />,
        ctaText: <Trans i18nKey="onboarding.stepImportAccounts.warning.cta" />,
      },
    },
    type: "primary",
    id: "importRecoveryPhrase",
  },
];

export { getSetupDeviceScenes, recoveryPhraseScenes, importAccountsScenes };
