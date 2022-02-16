import { bridge } from "../engine";
const { device, element, by, waitFor, default: detox } = require("detox");

describe("Receive Crypto", () => {
  beforeAll(async () => {
    await device.launchApp({
      // delete: true,
    });
  });

  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  it("should be able to receive BTC", async () => {
    bridge.loadConfig("1AccountBTC1AccountETH", true);

    // navigate to account
    await element(by.id("transfer-button"))
      .atIndex(0)
      .tap();

    await element(by.text("Receive")).tap();
    await element(by.text("Ethereum 2")).tap();
    // await element(by.text("Add new Ledger Nano X")).tap();
    await element(by.text("Continue without my device")).tap();
    await wait(10000);
    // click receive

    //modal stuff
  });
});
