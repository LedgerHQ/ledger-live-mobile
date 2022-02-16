import { bridge } from "../engine";
const { device, element, by, waitFor, default: detox } = require("detox");

describe("Password Lock Screen", () => {
  beforeAll(async () => {
    await device.launchApp({
      //
    });
  });

  it("should be able to enter the correct password", async () => {
    bridge.loadConfig("onboardingcompleted", true);
    // test code here
  });
});
