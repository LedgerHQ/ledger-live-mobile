//@flow
import Transport from "@ledgerhq/hw-transport";
import { BleManager } from "react-native-ble-plx";

const DefaultServiceUuid = "d973f2e0-b19e-11e2-9e96-0800200c9a66";
const DefaultWriteCharacteristicUuid = "d973f2e2-b19e-11e2-9e96-0800200c9a66";
const DefaultNotifyCharacteristicUuid = "d973f2e1-b19e-11e2-9e96-0800200c9a66";
const ClientCharacteristicConfig = "00002902-0000-1000-8000-00805f9b34fb";

type Device = *;
type Characteristic = *;

function chunkBuffer(buffer: Buffer, size: number): Array<Buffer> {
  const chunks = [];
  for (let i = 0; i < buffer.length; i += size) {
    chunks.push(buffer.slice(i * size, (i + 1) * size));
  }
  return chunks;
}

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
    const all = {};
    const onBleStateChange = (state: string) => {
      if (state === "PoweredOn") {
        bleManager.startDeviceScan(null, null, (bleError, device) => {
          if (bleError) {
            observer.error(bleError);
            unsubscribe();
            return;
          }
          if (!all[device.id]) console.log(device);
          all[device.id] = device;

          if (!device.name) return;
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
    /*
    await device.discoverAllServicesAndCharacteristics();
    const services = await device.services();
    console.log(device, services);
    for (const service of services) {
      const characteristics = await service.characteristics();
      console.log(service, characteristics);

    }
    */
    const characteristics = await device.characteristicsForService(
      DefaultServiceUuid
    );
    let writeCharacteristic, notifyCharacteristic;
    for (const c of characteristics) {
      if (c.id === DefaultWriteCharacteristicUuid) {
        writeCharacteristic = c;
      } else if (c.id === DefaultNotifyCharacteristicUuid) {
        notifyCharacteristic = c;
      }
    }
    if (!writeCharacteristic) {
      throw new Error("no write characteristic found");
    }
    if (!notifyCharacteristic) {
      throw new Error("no notify characteristic found");
    }
    if (!notifyCharacteristic.isNotifiable) {
      throw new Error("notify characteristic is not notifiable");
    }
    return new BluetoothTransport(
      device,
      writeCharacteristic,
      notifyCharacteristic
    );
  }

  device: Device;
  writeCharacteristic: Characteristic;
  notifyCharacteristic: Characteristic;
  constructor(
    device: Device,
    writeCharacteristic: Characteristic,
    notifyCharacteristic: Characteristic
  ) {
    super();
    this.device = device;
    this.writeCharacteristic = writeCharacteristic;
    this.notifyCharacteristic = notifyCharacteristic;
    device.onDisconnected(e => {
      this.emit("disconnect", e);
    });
  }

  /**
   *  Ledger Bluetooth Low Energy APDU Protocol
   *  Characteristic content:
   *  [______________________________]
   *   TT SSSS VVVV................VV
   *
   *  All fields are big endian encoded.
   *  TT: 1 byte content tag
   *  SSSS: 2 bytes sequence number, big endian encoded (start @ 0).
   *  VVVV..VV: variable length content. When SSSS is 0, the first two bytes encodes in big endian the total length of the APDU to transport.
   *
   *  Command/Response APDU are split in chunks to fill up the bluetooth's characteristic
   *
   *  APDU are using either standard or extended header. up to the application to check the total received length and the lc field
   *
   *  Tags:
   *  Direction: < and >  T:0x05 S=<sequence-idx-U2BE> V=<seq==0?totallength(U2BE):NONE><apducontent> APDU (command/response) packet.
   *
   * Example:
   * --------
   *   Wrapping of Command APDU:
   *     E0 FF 12 13 14
   *     15 16 17 18 19 1A 1B 1C
   *     1D 1E 1F 20 21 22 23 24
   *     25 26 27 28 29 2A 2B 2C
   *     2D 2E 2F 30 31 32 33 34
   *     35
   *   Result in 3 chunks (20 bytes at most):
   *     0500000026E0FF12131415161718191A1B1C1D1E
   *     0500011F202122232425262728292A2B2C2D2E2F
   *     050002303132333435
   *
   *
   *   Wrapping of Response APDU:
   *     15 16 17 18 19 1a 1b 1c
   *     1d 1e 1f 20 21 22 23 24
   *     25 26 27 28 29 2a 2b 2c
   *     2d 2e 2f 30 31 32 33 34
   *     35 90 00
   *   Result in 3 chunks (20 bytes at most):
   *     050000002315161718191a1b1c1d1e1f20212223
   *     0500012425262728292a2b2c2d2e2f3031323334
   *     050002359000
   */

  busy = false;
  exchange(apduHex: string, statusList: Array<number>): Promise<string> {
    const { writeCharacteristic, notifyCharacteristic } = this;
    if (this.busy) {
      return Promise.reject(new Error("exchange() race exception"));
    }
    this.busy = true;
    let monitorSubscription;
    const apdu = Buffer.from(apduHex, "hex");
    return new Promise((resolve, reject) => {
      const tagId = 0x05;
      const maxChunkBytes = 20;
      let notifiedIndex = 0,
        notifiedDataLength = 0,
        notifiedData = Buffer.alloc(0);
      monitorSubscription = notifyCharacteristic.monitor((error, c) => {
        const value = Buffer.from(c.value, "base64");
        const tag = value.readUInt8(0);
        const index = value.readUInt16BE(1);
        let data = value.slice(3);
        if (tag !== tagId) {
          return reject(new Error("BLE: invalid tag=" + tag));
        }
        if (notifiedIndex !== index) {
          return reject(new Error("BLE: missing chunk " + notifiedIndex));
        }
        if (index === 0) {
          notifiedDataLength = data.readUInt16BE(0);
          data = data.slice(2);
        }
        notifiedIndex++;
        notifiedData = Buffer.concat([notifiedData, data]);
        if (notifiedData.length > notifiedDataLength) {
          return reject(
            new Error(
              "BLE: received too much data. Excepted " +
                notifiedDataLength +
                " received " +
                notifiedData.length
            )
          );
        } else if (notifiedData.length === notifiedDataLength) {
          return resolve(notifiedData);
        }
      });

      const chunks = chunkBuffer(apdu, maxChunkBytes - 6).map((buffer, i) => {
        const indexBuffer = Buffer.alloc(2);
        indexBuffer.writeUInt16BE(i, 0);
        return Buffer.concat([Buffer.from([tagId]), indexBuffer, buffer]);
      });
      chunks.forEach(chunk => {
        writeCharacteristic.writeWithoutResponse(chunk.toString("base64"));
      });
    })
      .then(data => ({ data, error: null }), error => ({ data: null, error }))
      .then(result => {
        this.busy = false;
        if (monitorSubscription) {
          monitorSubscription.remove();
        }
        if (result.error || !result.data) throw result.error;
        else {
          const status = result.data.readUInt16BE(result.data.length - 2);
          const statusFound = statusList.some(s => s === status);
          if (!statusFound) {
            throw new Error("Invalid status " + status.toString(16));
          }
          return result.data.toString("hex");
        }
      });
  }

  setScrambleKey() {}

  close(): Promise<void> {
    return Promise.resolve();
  }
}
