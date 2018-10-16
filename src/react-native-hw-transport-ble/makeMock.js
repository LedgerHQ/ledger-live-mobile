// @flow

import Transport from "@ledgerhq/hw-transport";
import { from } from "rxjs";

export type DeviceMock = {
  id: string,
  name: string,
  mock_exchange: Buffer => Promise<Buffer>,
  mock_close: () => Promise<void>,
};

type Opts = {
  createTransportDeviceMock: (id: string) => DeviceMock,
};

const defaultOpts = {
  observeState: from([{ type: "PoweredOn", available: true }]),
};

export default (opts: Opts) => {
  const { observeState, createTransportDeviceMock } = {
    ...defaultOpts,
    ...opts,
  };

  return class BluetoothTransportMock extends Transport<DeviceMock | string> {
    static isSupported = (): Promise<boolean> => Promise.resolve(true);

    static observeState = (o: *) => observeState.subscribe(o);

    static list = () => Promise.resolve([createTransportDeviceMock("mock_1")]);

    static listen(observer: *) {
      const unsubscribe = () => {};
      observer.next({
        type: "add",
        descriptor: createTransportDeviceMock("mock_1"),
      });
      observer.next({
        type: "add",
        descriptor: createTransportDeviceMock("mock_2"),
      });
      observer.next({
        type: "add",
        descriptor: createTransportDeviceMock("mock_3"),
      });
      return { unsubscribe };
    }

    static async open(device: *) {
      return new BluetoothTransportMock(
        typeof device === "string" ? createTransportDeviceMock(device) : device,
      );
    }

    device: DeviceMock;

    constructor(device: DeviceMock) {
      super();
      this.device = device;
    }

    async exchange(apdu: Buffer): Promise<Buffer> {
      return this.device.mock_exchange(apdu);
    }

    setScrambleKey() {}

    close(): Promise<void> {
      return this.device.mock_close();
    }
  };
};
