import { loadConfig } from "../bridge/server";

const { device, element, by, waitFor } = require("detox");

describe("Password Lock Screen", () => {
  beforeAll(async () => {
    await device.launchApp({
      // delete: true,
    });
  });

  it("should be able to enter the correct password", async () => {
    loadConfig("1AccountBTC1AccountETH", true);

    // navigate to settings cog
    await element(by.id("settings-icon")).tap();

    // navigate to general
    await element(by.id("general-settings-card")).tap();

    // toggle password toggle
    await waitFor(element(by.id("password-settings-toggle")))
      .toBeVisible()
      .whileElement(by.id("general-settings-scroll-view"))
      .scroll(200, "down", NaN, 0.5);

    // enter 'password123!' and click confirm
    await element(by.id("password-text-input")).typeText("passWORD$123!");
    await element(by.id("Proceed")).tap();

    // enter 'password123!' and click confirm again
    await element(by.id("password-text-input")).typeText("passWORD$123!");
    await element(by.id("Proceed")).tap();

    // exit app

    // wait for a bit

    // open app again

    // enter password

    // verify app opens
  });
});
