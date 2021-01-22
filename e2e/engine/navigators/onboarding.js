// @flow
import { E2EBridgeServer } from "../bridge/server";
import { $tap, $proceed, $visible, $scroll, $ } from "../helper";

export class Onboarding {
  bridge: E2EBridgeServer;

  constructor(bridge: E2EBridgeServer) {
    this.bridge = bridge;
  }

  async acceptTerms() {
    await $proceed();
    await $tap("TermsAcceptSwitch");
    await $tap("TermsAcceptSwitchPrivacy");
    await $proceed();
  }

  async selectNano(modelId: DeviceModelId) {
    await this.acceptTerms();
    await $tap(`Onboarding Device - Selection|${modelId}`);
  }

  async connectNano(modelId: DeviceModelId) {
    await this.selectNano(modelId);
    const el = $(`Onboarding - Connect|${modelId}`);
    // TODO E2E: utilize whileElement
    try {
      await $visible(el);
    } catch (e) {
      await $scroll(300);
    } finally {
      await $tap(el);
    }
  }

  async runAll(): Promise<void> {
    await this.connectNano("nanoX");

    await $tap("OnboardingStemPairNewContinue");
    await $proceed();
    const [david] = this.addDevices();
    // TODO E2E: Android
    await $tap(`DeviceItemEnter ${david}`);
    this.bridge.setInstalledApps();
    this.bridge.open();
    await $proceed();
    await $tap("OnboardingFinish");
  }

  addDevices(
    deviceNames: string[] = [
      "Nano X de David",
      "Nano X de Arnaud",
      "Nano X de Didier Duchmol",
    ],
  ): string[] {
    deviceNames.forEach((name, i) => {
      this.bridge.add(`mock_${i + 1}`, name);
    });
    return deviceNames;
  }
}

type DeviceModelId = "nanoS" | "nanoX" | "blue";
