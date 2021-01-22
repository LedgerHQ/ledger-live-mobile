// @flow
import * as bridge from "../bridge/server";
import { $tap, $proceed, $, $scrollTill } from "../utils";

export function onboard(modelId: DeviceModelId) {
  welcome();
  acceptTerms();
  selectNano(modelId);
  connectNano(modelId);
}

function welcome() {
  it.todo("should show welcome screen");

  it("should go terms screen", async () => {
    await $proceed();
  });
}

function acceptTerms() {
  it("should check terms and policy", async () => {
    await $tap("TermsAcceptSwitch");
    await $tap("TermsAcceptSwitchPrivacy");
  });

  it("should enter Ledger App", async () => {
    await $proceed();
  });
}

export async function selectNano(modelId: DeviceModelId) {
  it(`should go connect screen for ${modelId}`, async () => {
    await $tap(`Onboarding Device - Selection|${modelId}`);
  });
}

export async function connectNano(modelId: DeviceModelId) {
  if (modelId === "nanoX") {
    it("should pair Nano through Bluetooth", async () => {
      const el = $(`Onboarding - Connect|${modelId}`);
      await $scrollTill(el);
      await $tap(el);
      await $tap("OnboardingStemPairNewContinue");
      await $proceed();
      const [david] = addDevices();
      // TODO E2E: Android
      await $tap(`DeviceItemEnter ${david}`);
      bridge.setInstalledApps();
      bridge.open();
      await $proceed();
      await $tap("OnboardingFinish");
    });
  }
}

function addDevices(
  deviceNames: string[] = [
    "Nano X de David",
    "Nano X de Arnaud",
    "Nano X de Didier Duchmol",
  ],
): string[] {
  deviceNames.forEach((name, i) => {
    bridge.add(`mock_${i + 1}`, name);
  });
  return deviceNames;
}

type DeviceModelId = "nanoS" | "nanoX" | "blue";
