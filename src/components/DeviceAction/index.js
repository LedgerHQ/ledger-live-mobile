// @flow
import React from "react";
import { ScrollView } from "react-native";
import type {
  Action,
  Device,
} from "@ledgerhq/live-common/lib/hw/actions/types";
import LText from "../LText";
import { ConnectDevice, Loading } from "./components";

type Props<R, H, P> = {
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
  Result,
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
  } = status;

  // if ((!isLoading && !device) || unresponsive) {
  //   return <ConnectDevice />;
  // }

  // if (isLoading) {
  //   return <Loading />;
  // }

  const payload = action.mapResult(status);

  // if (!payload) {
  //   return null;
  // }

  return (
    <ScrollView>
      <LText>{JSON.stringify(status, null, 2)}</LText>
      <LText>{JSON.stringify(payload, null, 2)}</LText>
    </ScrollView>
  );
}
