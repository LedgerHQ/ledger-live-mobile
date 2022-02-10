// @flow
import { cleanLaunch, bridge } from "../engine";
const { device, element, by, waitFor } = require("detox");

import { $waitFor } from "../engine/utils";

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}


describe("Mobile E2E Test Engine", () => {
  describe("Bridge", () => {
    describe("loadConfig", () => {
      beforeAll(async () => {
        await cleanLaunch();
      });

      it("should import accounts", async () => {
        await bridge.loadConfig("allLiveCoinsNoOperations", true);
    
        const accountTabButton = element(by.id("TabBarAccounts"));
        await $waitFor(accountTabButton);
        await accountTabButton.tap();

        const firstAccountButton = element(by.text("Bitcoin 1 (legacy)"))
        await $waitFor(firstAccountButton);
        firstAccountButton.tap();

        await wait(100000);
      });
    });
  });
});
