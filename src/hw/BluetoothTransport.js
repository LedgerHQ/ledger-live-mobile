//@flow
import Transport from "@ledgerhq/hw-transport";
import { BleManager } from "react-native-ble-plx";

const DefaultServiceUuid = "d973f2e0-b19e-11e2-9e96-0800200c9a66";
const DefaultWriteCharacteristicUuid = "d973f2e2-b19e-11e2-9e96-0800200c9a66";
const DefaultNotifyCharacteristicUuid = "d973f2e1-b19e-11e2-9e96-0800200c9a66";
const ClientCharacteristicConfig = "00002902-0000-1000-8000-00805f9b34fb";

type Device = *;

export default class BluetoothTransport extends Transport<Device> {
  static list = (): * => Promise.resolve([]);

  static discover(observer: *) {
    let bleManager;
    try {
      bleManager = new BleManager();
    } catch (e) {
      // basically for the tests to pass
      console.warn(e);
      return { unsubscribe: () => {} };
    }
    const unsubscribe = () => {
      sub.remove();
      bleManager.stopDeviceScan();
    };
    const onBleStateChange = (state: string) => {
      if (state === "PoweredOn") {
        bleManager.startDeviceScan(null, null, (bleError, device) => {
          if (bleError) {
            observer.error(bleError);
            unsubscribe();
            return;
          }
          if (!device.name) return;
          console.log("BLE found " + device.name, device);
          if (device.name.includes("ledger")) {
            observer.next(device);
          }
        });
        if (sub) sub.remove();
      } else if (state === "Unsupported") {
        unsubscribe();
        observer.error(new Error("Bluetooth BLE is not supported"));
      }
    };
    const sub = bleManager.onStateChange(onBleStateChange, true);
    return { unsubscribe };
  }

  static async open(device: Device, timeout?: number) {
    await device.connect();
    await device.discoverAllServicesAndCharacteristics();
    const services = await device.services();
    console.log(device, services);
    for (const service of services) {
      const characteristics = await service.characteristics();
      console.log(service, characteristics);
    }
    return new BluetoothTransport(device /* more to pass? */);
  }

  device: Device;
  constructor(device: Device) {
    super();
    this.device = device;
    device.onDisconnected(e => {
      this.emit("disconnect", e);
    });
  }

  async exchange(apduHex: string, statusList: Array<number>): Promise<string> {
    throw new Error("BluetoothTransport.exchange not implemented");
  }

  setScrambleKey() {}

  close(): Promise<void> {
    return Promise.resolve();
  }
}
