import { bridge } from "../engine";
const { device, element, by, waitFor, default: detox } = require("detox");

describe("Password Lock Screen", () => {
  beforeAll(async () => {
    await device.launchApp({
      //
    });
    bridge.loadConfig("allLiveCoinsNoOperations", true);
  });

  it("should be able to enter the correct password", async () => {
    // test code here
  });
});
