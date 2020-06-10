describe("Ledger Live Mobile", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have welcome screen", async () => {
    await element(by.id("OnboardingWelcomeContinue")).tap();
    await element(by.id("OnboardingDeviceNanoX"));
  });
});
