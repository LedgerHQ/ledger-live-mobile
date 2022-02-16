import { device, element, by, waitFor } from "detox";
import * as bridge from "../engine/bridge/server";

describe("Onboarding", () => {
  beforeAll(async () => {
    await device.launchApp(
      // { delete: true }
      {
        launchArgs: {
          ENVFILE: ".env.mock",
        },
      },
    );
  });

  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  it("should contect a Nano X", async () => {
    // get started
    // await wait(5000);
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
    console.log("------ waiting for pair continue");

    await element(by.id("OnboardingStemPairNewContinue")).tap();
    console.log("------ just clicked start new pair");

    //proceed
    await element(by.id("Proceed")).tap();
    console.log("------ just clicked proceed");
    // wait(5000);

    //add device
    const [david] = bridge.addDevices();
    await waitFor(element(by.id(`DeviceItemEnter ${david}`)))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id(`DeviceItemEnter ${david}`)).tap();

    bridge.setInstalledApps();
    bridge.open();
  });
});
