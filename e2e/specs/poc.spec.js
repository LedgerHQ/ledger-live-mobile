// @flow
import { cleanLaunch, bridge } from "../engine";

describe("Mobile E2E Testing Proof of Concept", () => {
  it("should import settings", async () => {
    await cleanLaunch();
    await bridge.loadConfig("onboardingcompleted", true);
  });

  // TODO E2E: figure out a way to stop animation on Portfolio screen
  it("should import accounts", async () => {
    await cleanLaunch();
    await bridge.loadConfig("1AccountBTC1AccountETH", true);
  });
});
