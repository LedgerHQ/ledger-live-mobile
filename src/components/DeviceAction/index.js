// @flow
import React from "react";
import type {
  Action,
  Device,
} from "@ledgerhq/live-common/lib/hw/actions/types";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import ValidateOnDevice from "../ValidateOnDevice";
import {
  renderWarningOutdated,
  renderConnectYourDevice,
  renderLoading,
  renderAllowOpeningApp,
  renderRequestQuitApp,
  renderRequiresAppInstallation,
  renderAllowManager,
  renderInWrongAppForAccount,
  renderError,
  renderBootloaderStep,
} from "./rendering";

type Props<R, H, P> = {
  onResult?: (paylaod: P) => Promise<void>,
  action: Action<R, H, P>,
  request?: R,
  device: Device,
};

export default function DeviceAction<R, H, P>({
  action,
  request = null,
  device: selectedDevice,
  onResult,
}: Props<R, H, P>) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const status = action.useHook(selectedDevice, request);
  const {
    appAndVersion,
    device,
    unresponsive,
    error,
    isLoading,
    allowManagerRequestedWording,
    requestQuitApp,
    deviceInfo,
    requestOpenApp,
    allowOpeningRequestedWording,
    requiresAppInstallation,
    inWrongDeviceForAccount,
    onRetry,
    deviceSignatureRequested,
    deviceStreamingProgress,
    displayUpgradeWarning,
    passWarning,
  } = status;

  const modelId = device?.modelId ?? selectedDevice.modelId;

  if (displayUpgradeWarning && appAndVersion) {
    return renderWarningOutdated({
      t,
      appName: appAndVersion.name,
      passWarning,
      navigation,
    });
  }

  if (requestQuitApp) {
    return renderRequestQuitApp({
      t,
      modelId,
    });
  }

  if (requiresAppInstallation) {
    const { appName } = requiresAppInstallation;
    return renderRequiresAppInstallation({
      t,
      navigation,
      appName,
    });
  }

  if (allowManagerRequestedWording) {
    const wording = allowManagerRequestedWording;
    return renderAllowManager({ t, modelId, wording });
  }

  if (allowOpeningRequestedWording || requestOpenApp) {
    // requestOpenApp for Nano S 1.3.1 (need to ask user to open the app.)
    const wording = allowOpeningRequestedWording || requestOpenApp;
    return renderAllowOpeningApp({
      t,
      navigation,
      modelId,
      wording,
      tokenContext: request?.tokenCurrency,
      isDeviceBlocker: !requestOpenApp,
    });
  }

  if (inWrongDeviceForAccount) {
    return renderInWrongAppForAccount({
      t,
      onRetry,
      accountName: inWrongDeviceForAccount.accountName,
    });
  }

  if (!isLoading && error) {
    return renderError({
      t,
      error,
      onRetry,
    });
  }

  if ((!isLoading && !device) || unresponsive) {
    return renderConnectYourDevice({
      t,
      modelId,
      unresponsive,
    });
  }

  if (isLoading) {
    return renderLoading({ t });
  }

  if (deviceInfo && deviceInfo.isBootloader) {
    return renderBootloaderStep({ t });
  }

  if (request && device && deviceSignatureRequested) {
    const { account, parentAccount, status, transaction } = request;
    if (account && status && transaction) {
      return (
        <ValidateOnDevice
          {...device}
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          status={status}
        />
      );
    }
  }

  if (typeof deviceStreamingProgress === "number") {
    return renderLoading({
      t,
      description:
        deviceStreamingProgress > 0
          ? t("send.verification.streaming.accurate", {
              percentage: (deviceStreamingProgress * 100).toFixed(0) + "%",
            })
          : t("send.verification.streaming.inaccurate"),
    });
  }

  const payload = action.mapResult(status);

  if (!payload) {
    return null;
  }

  if (onResult) {
    onResult(payload);
  }

  return null;
}
