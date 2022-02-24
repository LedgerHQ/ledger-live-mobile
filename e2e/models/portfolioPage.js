import * as testHelpers from "../helpers";

export default class PortfolioPage {
  static async navigateToSettings() {
    await testHelpers.tap("settings-icon");
  }

  static isVisible() {
    return testHelpers.verifyIsVisible("transfer-button");
  }
}
