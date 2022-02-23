import { device } from "detox";
import OnboardingSteps from "../models/onboarding/onboardingSteps";

describe("Onboarding", () => {
  beforeAll(async () => {
    await device.launchApp({
      // delete: true,
      launchArgs: {},
    });
  });

  it("should contect a Nano X", async () => {
    await OnboardingSteps.getStarted();
    await OnboardingSteps.acceptTerms();
    await OnboardingSteps.selectDevice("nanoX");
    await OnboardingSteps.connectYourNano("nanoX");
    await OnboardingSteps.acceptSeedWarning();
    await OnboardingSteps.startPairing();
    await OnboardingSteps.addNewNano();
    await OnboardingSteps.addDeviceViaBluetooth();
    await OnboardingSteps.openLedgerLive();

    // main portfolio page to verify it's visible
    // await OnboardingSteps.acceptTerms();
  });
});
