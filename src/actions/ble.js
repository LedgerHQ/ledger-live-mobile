// @flow

import type { DeviceLike } from "../reducers/ble";

export const removeKnownDevice = (deviceId: string) => ({
  type: "BLE_REMOVE_DEVICE",
  deviceId,
});

export const addKnownDevice = (device: DeviceLike) => ({
  type: "BLE_ADD_DEVICE",
  device,
});

export const importBle = (ble: *) => ({
  type: "BLE_IMPORT",
  ble,
});

export const saveBleDeviceName = (deviceId: string, name: string) => ({
  type: "BLE_SAVE_DEVICE_NAME",
  deviceId,
  name,
});
