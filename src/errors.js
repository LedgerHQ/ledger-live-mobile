// @flow
import { createCustomErrorClass } from "@ledgerhq/live-common/lib/errors/helpers";

export const BluetoothRequired = createCustomErrorClass("BluetoothRequired");
export const GenuineCheckFailed = createCustomErrorClass("GenuineCheckFailed");
export const PairingFailed = createCustomErrorClass("PairingFailed");
export const SyncError = createCustomErrorClass("SyncError");
export const PasswordCoolDown = createCustomErrorClass("PasswordCoolDown");
export const NotEnoughBalanceBecauseDestinationNotCreated = createCustomErrorClass(
  "NotEnoughBalanceBecauseDestinationNotCreated",
);
