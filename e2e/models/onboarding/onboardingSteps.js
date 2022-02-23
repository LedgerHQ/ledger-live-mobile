import * as bridge from "../../engine/bridge/server";
import * as testHelpers from "../../helpers";

export default class OnboardingSteps {
  static async getStarted() {
    await testHelpers.tap("Proceed");
  }

  static async acceptTerms() {
    await testHelpers.tap("TermsAcceptSwitch");
    await testHelpers.tap("Proceed");
  }

  static async selectDevice(device) {
    await testHelpers.tap(`Onboarding Device - Selection|${device}`);
  }

  static async connectYourNano(device) {
    await testHelpers.scrollToElementById(
      `Onboarding - Connect|${device}`,
      "UseCaseSelectScrollView",
      200,
      "down",
      NaN,
      0.5,
    );

    await testHelpers.tap(`Onboarding - Connect|${device}`);
  }

  static async acceptSeedWarning() {
    await testHelpers.delay(1000);
    await testHelpers.tap("Onboarding - Seed warning");
  }

  static async startPairing() {
    await testHelpers.tap("OnboardingStemPairNewContinue");
  }

  static async addNewNano() {
    await testHelpers.tap("Proceed");
  }

  static async addDeviceViaBluetooth() {
    const [david] = bridge.addDevices();
    await testHelpers.waitAndTap(`DeviceItemEnter ${david}`);

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
    // leaving wait for flaky 'device authentication check screen'

    await testHelpers.delay(5000);
    await testHelpers.tap("Proceed");
  }

  static async openLedgerLive() {
    await testHelpers.tapByText("Open Ledger Live");
  }
}

// export function onboard(modelId: DeviceModelId, usecase: Usecase) {
//   getStarted();
//   acceptTerms();
//   selectUsecase(modelId, usecase);
// }

// function getStarted() {
//   it("should go terms screen", async () => {
//     await $proceed();
//   });
// }

// function acceptTerms() {
//   it("should check terms and policy", async () => {
//     await $tap("TermsAcceptSwitch");
//   });

//   it("should enter Ledger App", async () => {
//     await $proceed();
//   });
// }

// async function selectUsecase(modelId: DeviceModelId, usecase: Usecase) {
//   it(`should go connect screen for ${modelId}`, async () => {
//     await $tap(`Onboarding Device - Selection|${modelId}`);
//   });

//   switch (usecase) {
//     case "connect":
//       if (modelId === "nanoX") {
//         await connectViaBluetooth(modelId);
//       }
//       break;
//     default:
//       break;
//   }
// }

// async function connectViaBluetooth(modelId: DeviceModelId) {
//   it("should pair Nano via Bluetooth", async () => {
//     const el = $(`Onboarding - Connect|${modelId}`);
//     await $scrollTill(el);
//     await $tap(el);
//     await $waitFor("Onboarding - Seed warning");
//     const dismissSeedWarning = $("Onboarding - Seed warning");
//     await $tap(dismissSeedWarning);
//     await $tap("OnboardingStemPairNewContinue");
//     await $proceed();
//     const [david] = bridge.addDevices();
//     // TODO E2E: Android
//     await $waitFor(`DeviceItemEnter ${david}`);
//     await $tap(`DeviceItemEnter ${david}`);
//     bridge.setInstalledApps();
//     bridge.open();
//     await $proceed();
//     await $tap("OnboardingFinish");
//   });
// }

// type DeviceModelId = "nanoS" | "nanoX" | "blue";

// type Usecase = "newDevice" | "import" | "restore" | "connect";
