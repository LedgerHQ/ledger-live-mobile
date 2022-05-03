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
    await testHelpers.delay(5000); // give time for devices to appear
    await testHelpers.tapByText("Nano X de David");

    bridge.setInstalledApps(); // tell LLM what apps the mock device has

    bridge.open(); // open ledger manager

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
