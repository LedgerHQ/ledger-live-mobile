//@flow
import Transport from "@ledgerhq/hw-transport";
import invariant from "invariant";
import { BleManager } from "react-native-ble-plx";

const ServiceUuid = "d973f2e0-b19e-11e2-9e96-0800200c9a66";
const WriteCharacteristicUuid = "d973f2e2-b19e-11e2-9e96-0800200c9a66";
const NotifyCharacteristicUuid = "d973f2e1-b19e-11e2-9e96-0800200c9a66";
const ClientCharacteristicConfig = "00002902-0000-1000-8000-00805f9b34fb";
const MaxChunkBytes = 20;
const TagId = 0x05;

type Device = *;
type Characteristic = *;

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

function chunkBuffer(
  buffer: Buffer,
  sizeForIndex: number => number
): Array<Buffer> {
  const chunks = [];
  for (
    let i = 0, size = sizeForIndex(0);
    i < buffer.length;
    i += size, size = sizeForIndex(i)
  ) {
    chunks.push(buffer.slice(i, i + size));
  }
  return chunks;
}

function receive(characteristic, debug) {
  let subscription;
  const promise = new Promise((resolve, reject) => {
    let notifiedIndex = 0,
      notifiedDataLength = 0,
      notifiedData = Buffer.alloc(0);
    subscription = characteristic.monitor((error, c) => {
      if (error) return reject(error);
      try {
        const value = Buffer.from(c.value, "base64");
        if (debug) {
          console.log("<=", value.toString("hex"));
        }
        const tag = value.readUInt8(0);
        const index = value.readUInt16BE(1);
        let data = value.slice(3);
        invariant(
          tag === TagId,
          "BLE: tag should be 05. Got %s",
          tag.toString(16)
        );
        invariant(
          notifiedIndex === index,
          "BLE: discontinued chunk. Received %s but expected %s",
          index,
          notifiedIndex
        );
        if (index === 0) {
          notifiedDataLength = data.readUInt16BE(0);
          data = data.slice(2);
        }
        notifiedIndex++;
        notifiedData = Buffer.concat([notifiedData, data]);
        invariant(
          notifiedData.length <= notifiedDataLength,
          "BLE: received too much data. Excepted %s, received %s",
          notifiedDataLength,
          notifiedData.length
        );
        if (notifiedData.length === notifiedDataLength) {
          resolve(notifiedData);
        }
      } catch (e) {
        reject(e);
      }
    });
  });
  invariant(subscription, "subscription defined");
  return { promise, subscription };
}

async function send(characteristic, apdu, termination, debug) {
  const chunks = chunkBuffer(apdu, i => MaxChunkBytes - (i === 0 ? 5 : 3)).map(
    (buffer, i) => {
      const head = Buffer.alloc(i === 0 ? 5 : 3);
      head.writeUInt8(TagId, 0);
      head.writeUInt16BE(i, 1);
      if (i === 0) {
        head.writeUInt16BE(apdu.length, 3);
      }
      return Buffer.concat([head, buffer]);
    }
  );
  let terminated = false;
  termination.then(() => {
    terminated = true;
  });
  for (let chunk of chunks) {
    if (terminated) return;
    if (debug) {
      console.log("=>", chunk.toString("hex"));
    }
    await characteristic.writeWithResponse(chunk.toString("base64"));
  }
}

export default class BluetoothTransport extends Transport<Device> {
  static list = (): * => Promise.resolve([]);

  static listen(observer: *) {
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
          if (device.name !== "Blue") return;
          //if (device.rssi < -50) return; // HACK to filter very close device
          console.log(device);
          observer.next({ type: "add", descriptor: device });
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
    for (const service of services) {
      const characteristics = await service.characteristics();
    }
    const characteristics = await device.characteristicsForService(ServiceUuid);
    invariant(characteristics, "service found");
    let writeC, notifyC;
    for (const c of characteristics) {
      if (c.uuid === WriteCharacteristicUuid) {
        writeC = c;
      } else if (c.uuid === NotifyCharacteristicUuid) {
        notifyC = c;
      }
    }
    invariant(writeC, "write characteristic found");
    invariant(notifyC, "notify characteristic found");
    invariant(notifyC.isNotifiable, "isNotifiable expected");
    invariant(writeC.isWritableWithResponse, "isWritableWithResponse expected");
    return new BluetoothTransport(device, writeC, notifyC);
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
      if (this.debug) {
        console.log("BLE disconnect", this.device);
      }
      this.emit("disconnect", e);
    });
  }

  busy = false;
  async exchange(apdu: Buffer): Promise<Buffer> {
    invariant(!this.busy, "exchange() race condition");
    this.busy = true;
    let receiving;
    try {
      receiving = receive(this.notifyCharacteristic, this.debug);
      send(this.writeCharacteristic, apdu, receiving.promise, this.debug);
      const data = await receiving.promise;
      return data;
    } finally {
      this.busy = false;
      if (receiving) {
        receiving.subscription.remove();
      }
    }
  }

  setScrambleKey() {}

  close(): Promise<void> {
    return Promise.resolve();
  }
}
