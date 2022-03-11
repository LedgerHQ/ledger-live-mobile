describe("WebdriverIO and Appium, when setup is fine,", () => {
  it("should be able to click on 'Get Started'", async () => {
    // await delay(10000);
    const getStartedButton = await $("~get-started-button");
    await getStartedButton.touchAction("tap");

    await delay(250);

    const termsCheckbox = await $("~terms-checkbox");
    termsCheckbox.touchAction("tap");

    await delay(250);

    const enterAppButton = await $("~enter-app-button");
    enterAppButton.touchAction("tap");

    await delay(5000);

    const deviceSelectionButton = await $(
      "~Onboarding Device - Selection|nanoX",
    );
    deviceSelectionButton.touchAction("tap");

    await delay(500);

    // ==================
    const connectNanoTile = await $("~Onboarding - Connect|nanoX");

    // =====================
    // await driver.touchPerform([    // doesn't work
    //   { action: "press", options: { x: 500, y: 250 } },
    //   { action: "wait", options: { ms: 500 } },
    //   { action: "moveTo", options: { x: 300, y: 1500 } },
    //   { action: "release" },
    // ]);

    // ===================

    // const useCaseContainer = await $("~use-case-container");
    // await useCaseContainer.scrollIntoView();

    // ======================
    // driver.performActions([       // doesn't work
    await browser.performActions([
      // this works
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: 500, y: 1500 },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 500 },
          {
            type: "pointerMove",
            duration: 5000,
            origin: "pointer",
            x: 0,
            y: -1500,
          },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    // await browser.releaseActions();

    // =======================
    // await browser.touchAction([
    //   { action: "press", x: 550, y: 1100 },
    //   { action: "moveTo", x: 550, y: 300 },
    //   "release",
    // ]);

    // =====================
    // await driver.touchScroll(0, 500, useCaseContainer); // doesn't work

    // await delay(10000);

    await connectNanoTile.touchAction("tap");
    await delay(500);

    const seedWarning = await $("~Onboarding - Seed warning");
    await seedWarning.touchAction("tap");

    const newPairContinue = await $("~OnboardingStemPairNewContinue");
    await newPairContinue.touchAction("tap");
    await delay(500);
  });
});

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
