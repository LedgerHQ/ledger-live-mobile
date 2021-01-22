// @flow
import { E2EBridgeServer, Onboarding, cleanLaunch } from "../engine";

describe("Mobile E2E Testing POC", () => {
  const bridge = new E2EBridgeServer();

  test("Onboarding", async () => {
    await cleanLaunch();
    const nav = new Onboarding(bridge);
    await nav.runAll();
  });

  test("settings import example", async () => {
    await cleanLaunch();
    await bridge.loadConfig("onboardingcompleted", true);
  });

  // TODO E2E: figure out a way to stop animation on Portfolio screen
  test("accounts import example", async () => {
    await cleanLaunch();
    await bridge.loadConfig("1AccountBTC1AccountETH", true);
  });
});
