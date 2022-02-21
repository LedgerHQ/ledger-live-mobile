import { device, element, by, waitFor } from "detox";
import * as bridge from "../engine/bridge/server";
import { $retryUntilItWorks, wait } from "../engine/utils";

describe("Onboarding", () => {
  beforeAll(async () => {
    await device.launchApp({
      // delete: true,
      launchArgs: {
        // ENVFILE: ".env.mock",
      },
    });
  });

  it("should contect a Nano X", async () => {
    // get started
    await element(by.id("Proceed")).tap();

    // accept terms
    await element(by.id("TermsAcceptSwitch")).tap();
    await element(by.id("Proceed")).tap();

    //select device
    await element(by.id("Onboarding Device - Selection|nanoX")).tap();

    //select connect
    await waitFor(element(by.id("Onboarding - Connect|nanoX")))
      .toBeVisible()
      .whileElement(by.id("UseCaseSelectScrollView"))
      .scroll(100, "down", NaN, 0.5);

    await element(by.id("Onboarding - Connect|nanoX")).tap();

    // Accept warning about seed phrase
    await element(by.id("Onboarding - Seed warning")).tap();

    // start pairing

    await element(by.id("OnboardingStemPairNewContinue")).tap();

    //proceed
    await element(by.id("Proceed")).tap();

    //add device
    const [david] = bridge.addDevices();
    await waitFor(element(by.id(`DeviceItemEnter ${david}`)))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id(`DeviceItemEnter ${david}`)).tap();

    // set globally installed apps - what is this?
    bridge.setInstalledApps();

    // open Ledger Live Manager on device
    bridge.open();

    // Continue to welcome screen
    await waitFor(
      element(by.text("Device authentication check")),
    ).not.toBeVisible();
    // issue here: the 'Pairing Successful' text is 'visible' before it actually is, so it's failing at the continue step as continue isn't actually visible
    await waitFor(element(by.text("Pairing Successful"))).toBeVisible();
    // leaving wait for flaky 'device authentication check screen'
    await wait(5000);
    await element(by.id("Proceed")).tap();

    // Open Ledger Live
    await element(by.text("Open Ledger Live")).tap();
  });
});
