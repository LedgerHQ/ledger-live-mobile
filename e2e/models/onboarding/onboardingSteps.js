import * as bridge from "../../bridge/server";
import * as testHelpers from "../../helpers";

export default class OnboardingSteps {
  static async waitForPageToBeVisible() {
    await testHelpers.waitForElement("Onboarding - Start");
  }

  static async startOnboarding() {
    await testHelpers.tap("Onboarding - Start");
  }

  static async chooseToSetupLedger() {
    await testHelpers.tap("Onboarding PostWelcome - Selection|SetupLedger");
  }

  static async selectYourDevice(device) {
    await testHelpers.tap(`Onboarding Device - Selection|${device}`);
  }

  static async chooseToConnectYourNano() {
    // scroll probably not needed now
    // await testHelpers.scrollToElementById(
    //   `Onboarding - Connect|${device}`,
    //   "UseCaseSelectScrollView",
    //   200,
    //   "down",
    //   NaN,
    //   0.5,
    // );

    await testHelpers.tap(`Onboarding - Connect`);
  }

  static async verifyContentsOfBoxAreChecked() {
    await testHelpers.tap("Onboarding - Seed warning");
  }

  static async chooseToPairMyNano() {
    await testHelpers.tap("Onboarding - Pair New Nano");
  }

  static async selectPairWithBluetooth() {
    await testHelpers.tapByText("Pair with bluetooth");
  }

  static async addDeviceViaBluetooth() {
    bridge.addDevices();
    await testHelpers.delay(5000);
    await testHelpers.tapByText("Nano X de David");
    // await testHelpers.waitAndTap(`DeviceItemEnter ${david}`);

    // set globally installed apps on device?
    bridge.setInstalledApps();

    // open ledger manager
    bridge.open();

    // Continue to welcome screen
    // await waitFor(
    // element(by.text("Device authentication check")),
    // ).not.toBeVisible();
    // issue here: the 'Pairing Successful' text is 'visible' before it actually is, so it's failing at the continue step as continue isn't actually visible
    // await waitFor(element(by.text("Pairing Successful"))).toBeVisible();

    // wait for flaky 'device authentication check screen'
    await testHelpers.delay(5000);
  }

  static async openLedgerLive() {
    await testHelpers.tapByText("Continue");
  }
}
