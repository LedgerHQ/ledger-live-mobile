// @flow

import { Buffer } from "buffer";
import Config from "react-native-config";
import BleTransport from "./BleTransport";
import makeMock from "./makeMock";

const transport = Config.MOCK_BLE
  ? makeMock({
      createTransportDeviceMock: id => ({
        id,
        name: id,
        mock_exchange: () => Promise.resolve(Buffer.from([0x90, 0x00])),
        mock_close: () => Promise.resolve(),
      }),
    })
  : BleTransport;

export default transport;
