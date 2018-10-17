// @flow
import Transport from "@ledgerhq/hw-transport";
import { delay } from "../promise";

// TODO will returns one of the specific error. errors are in live-common now

export default async (transport: Transport<*>): Promise<void> => {
  await delay(2000);
  await transport.send(0, 0, 0, 0);
};
