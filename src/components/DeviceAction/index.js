// @flow
import React from "react";
import type { TransactionState } from "@ledgerhq/live-common/lib/types";
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
  onResult: (transactionState: TransactionState) => void,
};

export default function DeviceAction<R, H, P>({
  action,
  request,
  device: selectedDevice,
  onResult,
}: Props<R, H, P>) {
  const txState = action.useHook(selectedDevice, request);
  const {
    // appAndVersion,
    device,
    unresponsive,
    // error,
    isLoading,
    // allowManagerRequestedWording,
    // requestQuitApp,
    // deviceInfo,
    // repairModalOpened,
    // requestOpenApp,
    // allowOpeningRequestedWording,
    // requiresAppInstallation,
    // inWrongDeviceForAccount,
    // onRetry,
    // onAutoRepair,
    // closeRepairModal,
    // onRepairModal,
    // deviceSignatureRequested,
    // deviceStreamingProgress,
    // displayUpgradeWarning,
    // passWarning,
  } = txState;

  if ((!isLoading && !device) || unresponsive) {
    return <ConnectDevice />;
  }

  if (isLoading) {
    return <Loading />;
  }

  onResult(txState);

  return <LText>{JSON.stringify(txState, null, 2)}</LText>;
}
