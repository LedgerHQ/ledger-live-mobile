// @flow
import { cleanLaunch, bridge } from "../engine";

describe("Mobile E2E Test Engine", () => {
  describe("Bridge", () => {
    describe("loadConfig", () => {
      beforeAll(async () => {
        await cleanLaunch();
      });

      it("should import settings", async () => {
        await bridge.loadConfig("onboardingcompleted", true);
      });

      it("should import accounts", async () => {
        await bridge.loadConfig("1AccountBTC1AccountETH", true);
      });
    });
    it("should import chart data", async () => {
      await bridge.loadCurrencyChartData("chartDataCompleted");
    });
    it("should import coin", async () => {
      await bridge.loadCurrencyInfo("symboldashboardcomleted");
    });
  });
});
