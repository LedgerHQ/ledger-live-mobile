// @flow
import React, { useState, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import connectManager from "@ledgerhq/live-common/lib/hw/connectManager";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import { Platform, View } from "react-native";
import { TrackScreen } from "../../../analytics";
import Button from "../../../components/Button";
import SelectDevice from "../../../components/SelectDevice";
import DeviceActionModal from "../../../components/DeviceActionModal";
import {
  installAppFirstTime,
  setReadOnlyMode,
} from "../../../actions/settings";

import OnboardingStepperView from "../../../components/OnboardingStepperView";
import ArrowRight from "../../../icons/ArrowRight";
import LText from "../../../components/LText";

const pairNewInfoModalProps = [
  {
    title: <Trans i18nKey="onboarding.stepPairNew.infoModal.title" />,
    desc: <Trans i18nKey="onboarding.stepPairNew.infoModal.desc" />,
  },
  {
    title: <Trans i18nKey="onboarding.stepPairNew.infoModal.title_1" />,
    bullets: [
      {
        Icon: ArrowRight,
        label: (
          <Trans i18nKey="onboarding.stepPairNew.infoModal.bullets.0.label" />
        ),
      },
      ...(Platform.OS === "android"
        ? [
            {
              Icon: ArrowRight,
              label: (
                <Trans
                  i18nKey="onboarding.stepPairNew.infoModal.bullets.1.label"
                  values={{ Os: Platform.OS }}
                >
                  {""}
                  <LText bold>{""}</LText>
                  {""}
                </Trans>
              ),
            },
          ]
        : []),
      {
        Icon: ArrowRight,
        label: (
          <Trans i18nKey="onboarding.stepPairNew.infoModal.bullets.2.label" />
        ),
        link: {
          label: (
            <Trans i18nKey="onboarding.stepPairNew.infoModal.bullets.2.link" />
          ),
          url: "",
        },
      },
    ],
  },
];

const action = createAction(connectManager);

type Props = {
  navigation: *,
  route: {
    params: {
      deviceModelId: "nanoS" | "nanoX" | "blue",
      next: string,
    },
  },
};

export default function OnboardingStepPairNew({ navigation, route }: Props) {
  const { deviceModelId, next } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [device, setDevice] = useState<?Device>();

  const onNext = useCallback(
    () => navigation.navigate(next, { ...route.params }),
    [navigation, next, route.params],
  );

  const Footer = () =>
    __DEV__ ? (
      <Button
        event="OnboardingPairSkip"
        type="lightSecondary"
        title="(DEV) skip this step"
        onPress={onNext}
      />
    ) : null;

  const directNext = useCallback(() => {
    dispatch(setReadOnlyMode(false));
    onNext();
  }, [dispatch, onNext]);

  const onResult = useCallback(
    (info: any) => {
      /** if list apps succeed we update settings with state of apps installed */
      if (info) {
        const hasAnyAppinstalled =
          info.result &&
          info.result.installed &&
          info.result.installed.length > 0;

        dispatch(installAppFirstTime(hasAnyAppinstalled));
        setDevice();
        dispatch(setReadOnlyMode(false));
        onNext();
      }
    },
    [dispatch, onNext],
  );

  const usbOnly = ["nanoS", "blue"].includes(deviceModelId);

  const scenes = [
    {
      sceneProps: {
        title: <Trans i18nKey="onboarding.stepPairNew.title" />,
        descs: [<Trans i18nKey="onboarding.stepPairNew.desc" />],
        ctaText: <Trans i18nKey="onboarding.stepPairNew.cta" />,
      },
      type: "primary",
      id: "pairNew_1",
    },
    {
      sceneProps: {
        children: (
          <>
            <TrackScreen category="Onboarding" name="PairNew" />
            <SelectDevice
              withArrows
              usbOnly={usbOnly}
              deviceModelId={deviceModelId}
              onSelect={usbOnly ? setDevice : directNext}
              autoSelectOnAdd
            />
            <DeviceActionModal
              onClose={setDevice}
              device={device}
              onResult={onResult}
              action={action}
              request={null}
            />
            {Footer}
          </>
        ),
      },
      sceneInfoModalProps: pairNewInfoModalProps,
      id: "pairNew_2",
      type: "secondary",
    },
  ];

  return (
    <OnboardingStepperView
      scenes={scenes}
      navigation={navigation}
      route={route}
      onFinish={onNext}
    />
  );
}
