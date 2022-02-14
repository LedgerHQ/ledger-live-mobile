// @flow
import { cleanLaunch, bridge } from "../engine";
const { device, element, by, waitFor, default: detox } = require("detox");

import { $waitFor, $retryUntilItWorks } from "../engine/utils";

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

describe("Navigation while syncing - performance test", () => {
  beforeAll(async () => {
    await device.launchApp({
      delete: true,
      launchArgs: {
        detoxURLBlacklistRegex: ".*://explorers.api.live.ledger.com/.*",
      },
    });
  });

  it("should import accounts", async () => {
    const initialTime = Date.now();
    await device.disableSynchronization();

    await $retryUntilItWorks(async () => {
      await bridge.loadConfig("allLiveCoinsNoOperations", true);
    });

    await $retryUntilItWorks(async () => {
      const accountTabButton = element(by.id("TabBarAccounts"));
      await waitFor(accountTabButton).toBeVisible();
      await wait(1000);
      await accountTabButton.tap();
    });

    await $retryUntilItWorks(async () => {
      const firstAccountButton = element(by.text("Komodo 1"));
      await waitFor(firstAccountButton).toBeVisible();
      await firstAccountButton.tap();
    });

    await device.enableSynchronization();

    console.log(
      `Test finished, took ${(Date.now() - initialTime) / 1000}s to execute`,
    );
  });
});
