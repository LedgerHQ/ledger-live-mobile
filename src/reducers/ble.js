// @flow
/* eslint import/no-cycle: 0 */
import { handleActions } from "redux-actions";
import type { State } from ".";

export type DeviceLike = {
  id: string,
  name: string,
};

export type BleState = {
  knownDevices: DeviceLike[],
};

const initialState: BleState = {
  knownDevices: [],
};

const handlers: Object = {
  BLE_ADD_DEVICE: (state: BleState, { device }: { device: DeviceLike }) => ({
    knownDevices: state.knownDevices
      .filter(id => id !== device.id)
      .concat({ id: device.id, name: device.name }),
  }),

  BLE_REMOVE_DEVICE: (state: BleState, { device }: { device: DeviceLike }) => ({
    knownDevices: state.knownDevices.filter(id => id !== device.id),
  }),

  BLE_IMPORT: (state: BleState, { ble }: { ble: BleState }) => ({
    ...state,
    ...ble,
  }),

  CLEAN_CACHE: (): BleState => initialState,
};

// Selectors
export const exportSelector = (s: State) => s.ble;

export const knownDevicesSelector = (s: State) => s.ble.knownDevices;

export default handleActions(handlers, initialState);
