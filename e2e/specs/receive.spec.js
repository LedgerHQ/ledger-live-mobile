import { bridge } from "../engine";
const { device, element, by, waitFor, default: detox } = require("detox");

describe("Receive Crypto", () => {
  beforeAll(async () => {
    await device.launchApp({
      //
    });
    bridge.loadConfig("allLiveCoinsNoOperations", true);
  });

  it("should be able to receive BTC", async () => {
    // test code here
  });
});
