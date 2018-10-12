// @flow
import Transport from "@ledgerhq/hw-transport";

export default async (
  transport: Transport<*>,
  name: string,
): Promise<boolean> => {
  // Temporary BLE thingy for demoing rename,
  // should use real APDU in final release

  const formattedName = Buffer.concat([
    Buffer.alloc(1),
    Buffer.from(name),
  ]).toString("base64");

  // $FlowFixMe
  if (!transport.renameCharacteristic) return false;
  await transport.renameCharacteristic.writeWithResponse(formattedName);

  return true;
};
