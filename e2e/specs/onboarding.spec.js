import { device, element, by, waitFor } from "detox";

describe("Onboarding", () => {
  beforeAll(async () => {
    await device
      .launchApp
      // { delete: true }
      ();
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

    const scrollElement = await element(by.id("ScrollView")).atIndex(0);

    await scrollElement.scrollTo("bottom");

    // await waitFor(element(by.id("Onboarding - Connect|nanoX")))
    //   .toBeVisible()
    //   .whileElement(scrollElement)
    //   .scroll(200, "down");
    await wait(5000);

    await element(by.id("Onboarding - Connect|nanoX")).tap();
    await wait(5000);
  });
});
