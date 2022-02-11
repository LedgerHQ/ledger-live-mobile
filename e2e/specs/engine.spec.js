// @flow
import { cleanLaunch, bridge } from "../engine";

describe("Mobile E2E Test Engine", () => {
  describe("Bridge", () => {
    describe("loadConfig", () => {
      beforeAll(async () => {
        await cleanLaunch();
      });

      it("should import settings", async () => {
        // these should probably get pulled out into separate describe blocks.
        await bridge.loadConfig("onboardingcompleted", true);
        // I think they might be in the wrong order
        //complete tests here
      });

      it("should import accounts", async () => {
        await bridge.loadConfig("1AccountBTC1AccountETH", true);
      });
    });
  });
});
