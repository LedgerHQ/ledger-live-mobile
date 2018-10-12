// @flow
import Transport from "@ledgerhq/hw-transport";

// TODO will returns one of the specific error. errors are in live-common now

export default async (transport: Transport<*>): Promise<void> => {
  // FIXME real genuine check!
  await transport.send(0, 0, 0, 0);
};
