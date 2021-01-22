// @flow
import { cleanLaunch, onboard } from "../engine";

describe("Onboarding", () => {
  describe("Nano X", () => {
    beforeAll(async () => {
      await cleanLaunch();
    });

    onboard("nanoX");
  });

  describe("Nano S", () => {});
});
