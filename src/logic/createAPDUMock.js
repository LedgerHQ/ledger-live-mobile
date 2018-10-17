// @flow

import { Buffer } from "buffer";
import { delay } from "./promise";

export type ApduMock = {
  exchange: Buffer => Promise<Buffer>,
  close: () => Promise<void>,
};

const genericErrorResponse = Buffer.from([0x6f, 0x42]);
const successResponse = Buffer.from([0x90, 0x00]);

export default (arg: {
  getDeviceName: () => string,
  setDeviceName: string => void,
  getAddress: () => {
    publicKey: string,
    address: string,
    chainCode: string,
  },
}): ApduMock => {
  async function exchange(input: Buffer) {
    await delay(100);
    /*
    const cla = input.readUInt8(0);
    const ins = input.readUInt8(1);
    */
    const clains = input.slice(0, 2).toString("hex");
    // const p1 = input.readUInt8(2);
    // const p2 = input.readUInt8(3);
    const dataLength = input.readUInt8(4);
    const data = input.slice(5, 5 + dataLength);

    switch (clains) {
      case "e0d2": {
        // get name
        return Buffer.from(arg.getDeviceName());
      }
      case "e0d4": {
        // set name
        arg.setDeviceName(data.toString());
        return successResponse;
      }
      case "e040": {
        // get address
        try {
          const addr = arg.getAddress();

          const pubKey = Buffer.from(addr.publicKey, "hex");
          const address = Buffer.from(addr.address, "ascii");
          const chainCode = Buffer.from(addr.chainCode, "hex");

          return Buffer.concat([
            Buffer.from([pubKey.length]),
            pubKey,
            Buffer.from([address.length]),
            address,
            chainCode,
          ]);
        } catch (e) {
          return genericErrorResponse;
        }
      }
      default:
        return successResponse;
    }
  }

  async function close() {
    return Promise.resolve();
  }

  return { exchange, close };
};
