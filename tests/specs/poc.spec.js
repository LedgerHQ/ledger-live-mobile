describe("WebdriverIO and Appium, when setup is fine,", () => {
  it("should be able to click on 'Get Started'", async () => {
    /*    await browser.setTimeout({
      script: 600000,
      implicit: 500000,
    });
*/
    const el = await $("~get-started-button");
    //    await el.waitForEnabled();
    await el.click();
    await browser.pause("2000");
  });
});
