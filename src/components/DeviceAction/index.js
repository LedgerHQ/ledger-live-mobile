// @flow
import React, { useEffect } from "react";
import type {
  Action,
  Device,
} from "@ledgerhq/live-common/lib/hw/actions/types";
import { useTranslation } from "react-i18next";
import { useNavigation, useTheme } from "@react-navigation/native";
import ValidateOnDevice from "../ValidateOnDevice";
import ValidateMessageOnDevice from "../ValidateMessageOnDevice";
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
  renderConfirmSwap,
  renderConfirmSell,
} from "./rendering";
import PreventNativeBack from "../PreventNativeBack";
import SkipLock from "../behaviour/SkipLock";

type Props<R, H, P> = {
  onResult?: (payload: *) => Promise<void> | void,
  onError?: (payload: *) => Promise<void> | void,
  renderOnResult?: (payload: P) => React$Node,
  action: Action<R, H, P>,
  request?: R,
  device: Device,
};

export default function DeviceAction<R, H, P>({
  action,
  request = null,
  device: selectedDevice,
  onResult,
  onError,
  renderOnResult,
}: Props<R, H, P>) {
  const { colors, dark } = useTheme();
  const theme = dark ? "dark" : "light";
  const { t } = useTranslation();
  const navigation = useNavigation();
  // TODO: fix flow type
  const status: any = action.useHook(selectedDevice, request);
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
    initSwapRequested,
    initSwapError,
    initSwapResult,
    signMessageRequested,
    allowOpeningGranted,
    initSellRequested,
    initSellResult,
    initSellError,
    installingApp,
    progress,
    listingApps,
  } = status;

  if (displayUpgradeWarning && appAndVersion) {
    return renderWarningOutdated({
      t,
      appName: appAndVersion.name,
      passWarning,
      navigation,
      colors,
      theme,
    });
  }

  if (requestQuitApp) {
    return renderRequestQuitApp({
      t,
      device: selectedDevice,
      colors,
      theme,
    });
  }

  if (installingApp) {
    const appName = requestOpenApp;
    return renderLoading({
      t,
      description: t("DeviceAction.installApp", {
        percentage: (progress * 100).toFixed(0) + "%",
        appName,
      }),
      colors,
      theme,
    });
  }

  if (requiresAppInstallation) {
    const { appName, appNames: maybeAppNames } = requiresAppInstallation;
    const appNames = maybeAppNames?.length ? maybeAppNames : [appName];

    return renderRequiresAppInstallation({
      t,
      navigation,
      appNames,
      colors,
      theme,
    });
  }

  if (allowManagerRequestedWording) {
    const wording = allowManagerRequestedWording;
    return renderAllowManager({
      t,
      device: selectedDevice,
      wording,
      colors,
      theme,
    });
  }

  if (listingApps) {
    return renderLoading({
      t,
      description: t("DeviceAction.listApps"),
      colors,
      theme,
    });
  }

  if (initSwapRequested && !initSwapResult && !initSwapError) {
    return renderConfirmSwap({ t, device: selectedDevice, colors, theme });
  }

  if (initSellRequested && !initSellResult && !initSellError) {
    return renderConfirmSell({ t, device: selectedDevice });
  }

  if (allowOpeningRequestedWording || requestOpenApp) {
    // requestOpenApp for Nano S 1.3.1 (need to ask user to open the app.)
    const wording = allowOpeningRequestedWording || requestOpenApp;
    return renderAllowOpeningApp({
      t,
      navigation,
      device: selectedDevice,
      wording,
      // $FlowFixMe
      tokenContext: request?.tokenCurrency,
      isDeviceBlocker: !requestOpenApp,
      colors,
      theme,
    });
  }

  if (inWrongDeviceForAccount) {
    return renderInWrongAppForAccount({
      t,
      onRetry,
      accountName: inWrongDeviceForAccount.accountName,
      colors,
      theme,
    });
  }

  if (!isLoading && error) {
    onError && onError(error);
    return renderError({
      t,
      navigation,
      error,
      managerAppName:
        error.name === "UpdateYourApp" ? error.managerAppName : undefined,
      onRetry,
      colors,
      theme,
    });
  }

  if ((!isLoading && !device) || unresponsive) {
    return renderConnectYourDevice({
      t,
      device: selectedDevice,
      unresponsive,
      colors,
      theme,
    });
  }

  if (isLoading || (allowOpeningGranted && !appAndVersion)) {
    return renderLoading({ t, colors, theme });
  }

  if (deviceInfo && deviceInfo.isBootloader) {
    return renderBootloaderStep({ t, colors, theme });
  }

  if (request && device && deviceSignatureRequested) {
    // $FlowFixMe
    const { account, parentAccount, status, transaction } = request;
    if (account && status && transaction) {
      navigation.setOptions({
        headerLeft: null,
        headerRight: null,
        gestureEnabled: false,
      });
      return (
        <>
          <PreventNativeBack />
          <SkipLock />
          <ValidateOnDevice
            device={device}
            account={account}
            parentAccount={parentAccount}
            transaction={transaction}
            status={status}
          />
        </>
      );
    }
  }

  if (request && device && signMessageRequested) {
    // $FlowFixMe
    const { account } = request;
    return (
      <>
        <PreventNativeBack />
        <SkipLock />
        <ValidateMessageOnDevice
          device={device}
          account={account}
          message={signMessageRequested}
        />
      </>
    );
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
      colors,
      theme,
    });
  }

  const payload = action.mapResult(status);

  if (!payload) {
    return null;
  }

  if (onResult) {
    return <RenderOnResultCallback onResult={onResult} payload={payload} />;
  }

  if (renderOnResult) {
    return renderOnResult(payload);
  }

  return null;
}

// work around for not updating state inside scope of main function with a callback
const RenderOnResultCallback = ({
  onResult,
  payload,
}: {
  onResult: (payload: *) => Promise<void> | void,
  payload: *,
}) => {
  // onDidMount
  useEffect(() => {
    onResult(payload);
  }, []);

  return null;
};
