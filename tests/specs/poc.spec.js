describe("WebdriverIO and Appium, when setup is fine,", () => {
  it("should be able to click on 'Get Started'", async () => {
    // await delay(10000);
    const getStartedButton = await $("~get-started-button");
    await getStartedButton.touchAction("tap");

    const termsCheckbox = await $("~terms-checkbox");
    termsCheckbox.touchAction("tap");

    const enterAppButton = await $("~enter-app-button");
    enterAppButton.touchAction("tap");

    const deviceSelectionButton = await $(
      "~Onboarding Device - Selection|nanoX",
    );
    deviceSelectionButton.touchAction("tap");

    await $("~Onboarding Device - Selection|nanoX").scrollIntoView();
    await delay(10000);
  });
});

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
