// @flow
/* eslint import/no-cycle: 0 */
import { handleActions } from "redux-actions";
import type { State } from ".";

export type BleState = {
  knownDeviceIds: string[],
};

const initialState: BleState = {
  knownDeviceIds: [],
};

const handlers: Object = {
  BLE_ADD_DEVICE: (state: BleState, { deviceId }: { deviceId: string }) => ({
    knownDeviceIds: state.knownDeviceIds
      .filter(id => id !== deviceId)
      .concat(deviceId),
  }),

  BLE_REMOVE_DEVICE: (state: BleState, { deviceId }: { deviceId: string }) => ({
    knownDeviceIds: state.knownDeviceIds.filter(id => id !== deviceId),
  }),
};

// Selectors

export const knownDeviceIdsSelector = (s: State) => s.ble.knownDeviceIds;

export default handleActions(handlers, initialState);
