import OnboardingSteps from "../models/onboarding/onboardingSteps";
import PortfolioPage from "../models/portfolioPage";
// import { expectBitmapsToBeEqual } from "../helpers";

describe("Onboarding", () => {
  beforeAll(async () => {
    console.log("==============> STARTING ONBOARDING DEVICE LAUNCH");
    await device.launchApp();
  });

  it("should be able to connect a Nano X", async () => {
    console.log("==============> STARTING ONBOARDING TEST");
    await OnboardingSteps.waitForPageToBeVisible();
    await OnboardingSteps.startOnboarding();
    await OnboardingSteps.chooseToSetupLedger();
    await OnboardingSteps.selectYourDevice("nanoX");
    await OnboardingSteps.chooseToConnectYourNano();
    await OnboardingSteps.verifyContentsOfBoxAreChecked();
    await OnboardingSteps.chooseToPairMyNano();
    await OnboardingSteps.selectPairWithBluetooth();
    await OnboardingSteps.addDeviceViaBluetooth();
    await OnboardingSteps.openLedgerLive();

    await PortfolioPage.waitForPageToBeVisible();
    await PortfolioPage.emptyPortfolioIsVisible();

    // in future for screenshot comparison
    // const image = await device.takeScreenshot("nanoX-onboarding-snapshot");
    // const snapshottedImagePath = `e2e/specs/snapshots/${device.getPlatform()}-nanoX-onboarding-snapshot.png`;
    // expectBitmapsToBeEqual(image, snapshottedImagePath);
  });
});
