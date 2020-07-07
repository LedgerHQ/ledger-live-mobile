// @flow
import React, { useEffect } from "react";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import LText from "../LText";
import { ConnectDevice, Loading } from "./components";

type Props<R, H, P> = {
  overridesPreferredDeviceModel?: DeviceModelId,
  Result?: React$ComponentType<P>,
  onResult?: P => void,
  action: Action<R, H, P>,
  request: R,
  device: Device,
};

export default function DeviceAction<R, H, P>({
  action,
  request,
  device: selectedDevice,
}: Props<R, H, P>) {
  const hookState = action.useHook(selectedDevice, request);
  const {
    appAndVersion,
    device,
    unresponsive,
    error,
    isLoading,
    allowManagerRequestedWording,
    requestQuitApp,
    deviceInfo,
    repairModalOpened,
    requestOpenApp,
    allowOpeningRequestedWording,
    requiresAppInstallation,
    inWrongDeviceForAccount,
    onRetry,
    onAutoRepair,
    closeRepairModal,
    onRepairModal,
    deviceSignatureRequested,
    deviceStreamingProgress,
    displayUpgradeWarning,
    passWarning,
  } = hookState;

  // if ((!isLoading && !device) || unresponsive) {
  //   return <ConnectDevice />;
  // }

  // if (isLoading) {
  //   return <Loading />;
  // }

  return <LText>{JSON.stringify(hookState, null, 2)}</LText>;
}
