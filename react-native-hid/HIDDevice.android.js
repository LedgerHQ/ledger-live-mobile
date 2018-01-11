import { Platform, NativeModules } from "react-native";
import Transport from "@ledgerhq/hw-transport";
import HIDDevice from "./HIDDevice";

export default class HIDTransport extends Transport {
  static list() {
    return NativeModules.HID.getDeviceList();
  }

  static async create(timeout?: number, debug?: boolean) {
    const list = await HIDDevice.list();
    const deviceObj = list.find(
      d =>
        (d.vendorId === 0x2581 && d.productId === 0x3b7c) ||
        d.vendorId === 0x2c97
    );
    if (!deviceObj) throw "No device found";
    const nativeObj = await NativeModules.HID.openDevice(deviceObj);
    return new HIDDevice(nativeObj.id);
  }

  constructor(id) {
    super();
    this.id = id;
  }

  async exchange(value = "", statusList: Array<number>) {
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
