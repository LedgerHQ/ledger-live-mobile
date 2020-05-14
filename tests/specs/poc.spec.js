describe("WebdriverIO and Appium, when setup is fine,", () => {
  it("should be able to click on 'Get Started'", async () => {
    const el = await $("~get-started-button");
    await el.click();
    await browser.pause("2000");
  });
});
