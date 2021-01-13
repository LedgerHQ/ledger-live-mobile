// @flow
import { E2EBridge, $, proceed } from "../engine";

describe("Mobile E2E Testing POC", () => {
  const bridge = new E2EBridge();

  test("Onboarding", async () => {
    await proceed();
    await $("OnboardingDeviceNanoX").tap();
    await $("OnboardingGetStartedChoiceInitialized").tap();
    await $("OnboardingPinYes").tap();
    await $("OnboardingRecoveryYes").tap();
    await proceed();
    // TODO E2E: invastigate why it matches multiple primary buttons
    await $("PairDevice").tap();
    const deviceNames = [
      "Nano X de David",
      "Nano X de Arnaud",
      "Nano X de Didier Duchmol",
    ];
    deviceNames.forEach((name, i) => {
      bridge.add(`mock_${i + 1}`, name);
    });
    await $(`DeviceItemEnter ${deviceNames[0]}`).tap();
    bridge.setInstalledApps();
    bridge.open();
    // TODO E2E: invastigate why it matches multiple primary buttons
    await $("PairDevicesContinue").tap();
    await $("OnboardingSkip").tap();
    // TODO E2E: invastigate why it matches multiple primary buttons
    await $("OnboardingShareDataContinue").tap();
    // TODO E2E: invastigate why it matches multiple primary buttons
    await element(by.id("OnboardingFinish")).tap();
    await element(by.id("TermsAcceptSwitch")).tap();
    await element(by.id("TermsConfirm")).tap();
  });

  test("accounts/settings import example", async () => {
    bridge.loadConfig("1AccountBTC1AccountETH", true);
  });
});
