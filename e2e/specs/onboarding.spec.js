import { device } from "detox";
import OnboardingSteps from "../models/onboarding/onboardingSteps";
import PortfolioPage from "../models/portfolioPage";
import { expectBitmapsToBeEqual } from "../helpers";

describe("Onboarding", () => {
  const snapshottedImagePath =
    "e2e/artifacts/android.debug.2022-02-24 22-55-35Z/✗ Onboarding should be able to connect a Nano X/nanoX-onboarding-snapshot.png";

  beforeAll(async () => {
    await device.launchApp({
      delete: true,
      launchArgs: {},
    });
  });

  it("should be able to connect a Nano X", async () => {
    await OnboardingSteps.getStarted();
    await OnboardingSteps.acceptTerms();
    await OnboardingSteps.selectDevice("nanoX");
    await OnboardingSteps.connectYourNano("nanoX");
    await OnboardingSteps.acceptSeedWarning();
    await OnboardingSteps.startPairing();
    await OnboardingSteps.addNewNano();
    await OnboardingSteps.addDeviceViaBluetooth();
    await OnboardingSteps.openLedgerLive();

    await PortfolioPage.emptyPortfolioIsVisible();

    const image = await device.takeScreenshot("nanoX-onboarding-snapshot");

    expectBitmapsToBeEqual(image, snapshottedImagePath);
  });
});
