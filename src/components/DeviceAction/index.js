// @flow
import React from "react";
import { ScrollView } from "react-native";
import type {
  Action,
  Device,
} from "@ledgerhq/live-common/lib/hw/actions/types";
import LText from "../LText";
import ValidateOnDevice from "../ValidateOnDevice";
import {
  renderConnectYourDevice,
  renderLoading,
  renderAllowOpeningApp,
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
  const status = action.useHook(selectedDevice, request);
  const {
    // appAndVersion,
    device,
    unresponsive,
    // error,
    isLoading,
    // allowManagerRequestedWording,
    // requestQuitApp,

    requestOpenApp,
    allowOpeningRequestedWording,
    // requiresAppInstallation,
    // inWrongDeviceForAccount,
    // onRetry,
    // onAutoRepair,
    // closeRepairModal,
    // onRepairModal,
    deviceSignatureRequested,
    // deviceStreamingProgress,
    // displayUpgradeWarning,
    // passWarning,
  } = status;

  if (allowOpeningRequestedWording || requestOpenApp) {
    // requestOpenApp for Nano S 1.3.1 (need to ask user to open the app.)
    const wording = allowOpeningRequestedWording || requestOpenApp;
    return renderAllowOpeningApp({ wording });
  }

  if ((!isLoading && !device) || unresponsive) {
    return renderConnectYourDevice();
  }

  if (isLoading) {
    return renderLoading();
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

  const payload = action.mapResult(status);

  if (!payload) {
    return null;
  }

  if (onResult) {
    onResult(payload);
  }

  return (
    <ScrollView>
      <LText>{JSON.stringify(status, null, 2)}</LText>
      <LText>{JSON.stringify(payload, null, 2)}</LText>
    </ScrollView>
  );
}
