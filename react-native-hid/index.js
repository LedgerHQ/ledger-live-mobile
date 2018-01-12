//@flow
import { Platform, NativeModules } from "react-native";
import Transport from "@ledgerhq/hw-transport";

type DeviceObj = {
  vendorId: number,
  productId: number
};

export default class HIDTransport extends Transport<DeviceObj> {
  static async list(): * {
    if (!NativeModules.HID) return Promise.resolve([]);
    const list = await NativeModules.HID.getDeviceList();
    return list.filter(
      d =>
        (d.vendorId === 0x2581 && d.productId === 0x3b7c) ||
        d.vendorId === 0x2c97
    );
  }

  static discover(observer: *) {
    if (!NativeModules.HID) return { unsubscribe: () => {} };
    let unsubscribed = false;
    HIDTransport.list().then(candidates => {
      for (const c of candidates) {
        if (!unsubscribed) {
          observer.next(c);
        }
      }
    });
    return {
      unsubscribe: () => {
        unsubscribed = true;
      }
    };
  }

  static async open(deviceObj: DeviceObj, timeout?: number) {
    const nativeObj = await NativeModules.HID.openDevice(deviceObj);
    return new HIDTransport(nativeObj.id);
  }

  id: number;

  constructor(id: number) {
    super();
    this.id = id;
  }

  async exchange(value: string, statusList: Array<number>) {
    const resultHex = await NativeModules.HID.exchange(this.id, value);
    const resultBin = Buffer.from(resultHex, "hex");
    const status =
      (resultBin[resultBin.length - 2] << 8) | resultBin[resultBin.length - 1];
    const statusFound = statusList.some(s => s === status);
    if (!statusFound) {
      throw "Invalid status " + status.toString(16);
    }
    return resultHex;
  }

  setScrambleKey() {}
}
