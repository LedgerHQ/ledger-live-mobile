// @flow
import { element, by, waitFor, device, expect } from "detox";
import { cleanLaunch, bridge, onboard } from "../engine";
import { delayApp } from "../engine/utils";
// import { navigate } from "../engine/flows/sidebar";

describe("Receive Flow", () => {
  beforeAll(async () => {
    console.log("-------> launching app");
    await cleanLaunch();
    console.log("-------> launched app");
  });

  // mainNavigator.js controls the tab at the bottom
  it("should be able to receive funds in the bitcoin account", async () => {
    console.log("-------> loading config");
    await bridge.loadConfig("1AccountBTC1AccountETH", true);
    console.log("-------> loaded config");
    console.log("-------> delay");
    await delayApp();
    console.log("-------> delay finished");
    console.log("-------> trying to find transfer button");
    await element(by.id("transfer-button1")).tap();
    console.log("-------> finished trying to find transfer button");
    await delayApp();
    await element(by.id("transfer-button2")).tap();
    // navigate("transfer-button");
  });
});
