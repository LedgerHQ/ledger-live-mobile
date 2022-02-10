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
        const initialTime = Date.now();
        await bridge.loadConfig("allLiveCoinsNoOperations", true);
        
        await device.disableSynchronization();
        const accountTabButton = element(by.id("TabBarAccounts"));
        await waitFor(accountTabButton)
        .toBeVisible();
        await wait(1000);
        await accountTabButton.tap();

        let shouldContinue = true;

        while(shouldContinue) {
          shouldContinue = false;
          const firstAccountButton = element(by.text("Komodo 1"));
          await waitFor(firstAccountButton)
          .toBeVisible();
          
          try {
            await firstAccountButton.tap();
          } catch {
            shouldContinue = true;
          }

          console.log("Trying again...");
        }

        await device.enableSynchronization();


        console.log(`Test finished, took ${(Date.now() - initialTime) / 1000}s to execute`);
      });
    });
  });
});
