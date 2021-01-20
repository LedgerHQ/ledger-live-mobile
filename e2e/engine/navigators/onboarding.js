// @flow
import { E2EBridge } from "../bridge";
import { $tap, $proceed } from "../query";

export class Onboarding {
  bridge: E2EBridge;

  constructor(bridge: E2EBridge) {
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
    await $tap(`Onboarding - Connect|${modelId}`);
  }

  async runAll(): Promise<void> {
    await this.connectNano("nanoX");

    await $tap("OnboardingStemPairNewContinue");
    await $proceed();
    const deviceNames = [
      "Nano X de David",
      "Nano X de Arnaud",
      "Nano X de Didier Duchmol",
    ];
    deviceNames.forEach((name, i) => {
      this.bridge.add(`mock_${i + 1}`, name);
    });
    await $tap(`DeviceItemEnter ${deviceNames[0]}`);
    this.bridge.setInstalledApps();
    this.bridge.open();
    await $proceed();
    await $tap("OnboardingFinish");
  }
}

type DeviceModelId = "nanoS" | "nanoX" | "blue";
