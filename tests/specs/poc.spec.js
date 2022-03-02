describe("WebdriverIO and Appium, when setup is fine,", () => {
  it("should be able to click on 'Get Started'", async () => {
    const el = await $("~get-started-button");
    // await el.click();
    await el.touchAction("tap");
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
