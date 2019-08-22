// @flow

import {
  toAccountRaw,
  fromAccountRaw,
} from "@ledgerhq/live-common/lib/account";
import type { Account } from "@ledgerhq/live-common/lib/types";
import type { State } from "../reducers";
import type { SettingsState } from "../reducers/settings";
import type { DeviceLike } from "../reducers/ble";

export type MockData = {
  name: string,
  accounts?: Account[],
  knownDevices?: DeviceLike[],
  settings?: $Shape<SettingsState>,
};

// used to log a store to add (click on LOG CURRENT)
export const toJSON = (state: State, name: string): Object => ({
  name,
  accounts: state.accounts.active.map(toAccountRaw),
  knownDevices: state.ble.knownDevices,
  settings: state.settings,
});

export const fromJSON = (json: Object): MockData => ({
  ...json,
  name: json.name || "unknown",
  accounts: (json.accounts || []).map(fromAccountRaw),
});

const data: MockData[] = [fromJSON(require("./1.json"))];

export default data;
