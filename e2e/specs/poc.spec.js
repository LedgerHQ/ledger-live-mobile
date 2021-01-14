// @flow
import { E2EBridge, Onboarding } from "../engine";

describe("Mobile E2E Testing POC", () => {
  const bridge = new E2EBridge();

  test("Onboarding", async () => {
    const nav = new Onboarding(bridge);
    await nav.runAll();
  });

  test("accounts/settings import example", async () => {
    await bridge.loadConfig("1AccountBTC1AccountETH", true);
  });
});
