// @flow
import { E2EBridge, $tap, $proceed } from "../engine";

describe("Mobile E2E Testing POC", () => {
  const bridge = new E2EBridge();

  test("Onboarding", async () => {
    await $proceed();
    await $tap("TermsAcceptSwitch");
    await $tap("TermsAcceptSwitchPrivacy");
    // TODO E2E: invastigate why it matches multiple primary buttons
    await $tap("Onboarding - ToU accepted");
    await $tap("Onboarding Device - Selection|nanoX");
    await $tap("Onboarding - Connect|nanoX");
    // TODO E2E: invastigate why it matches multiple primary buttons
    await $tap("OnboardingStemPairNewContinue");
    // TODO E2E: invastigate why it matches multiple primary buttons
    await $tap("PairDevice");
    const deviceNames = [
      "Nano X de David",
      "Nano X de Arnaud",
      "Nano X de Didier Duchmol",
    ];
    deviceNames.forEach((name, i) => {
      bridge.add(`mock_${i + 1}`, name);
    });
    await $tap(`DeviceItemEnter ${deviceNames[0]}`);
    bridge.setInstalledApps();
    bridge.open();
    // TODO E2E: invastigate why it matches multiple primary buttons
    await $tap("PairDevicesContinue");
    await $tap("OnboardingFinish");
  });

  test("accounts/settings import example", async () => {
    await bridge.loadConfig("1AccountBTC1AccountETH", true);
  });
});
