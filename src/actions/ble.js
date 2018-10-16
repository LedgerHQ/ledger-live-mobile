// @flow

export const removeKnownDevice = (deviceId: string) => ({
  type: "BLE_REMOVE_DEVICE",
  deviceId,
});

export const addKnownDevice = (deviceId: string) => ({
  type: "BLE_ADD_DEVICE",
  deviceId,
});
