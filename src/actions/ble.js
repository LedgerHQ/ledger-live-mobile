// @flow

import type { DeviceLike } from "../reducers/ble";

export const removeKnownDevice = (device: DeviceLike) => ({
  type: "BLE_REMOVE_DEVICE",
  device,
});

export const addKnownDevice = (device: DeviceLike) => ({
  type: "BLE_ADD_DEVICE",
  device,
});

export const importBle = (ble: *) => ({
  type: "BLE_IMPORT",
  ble,
});
