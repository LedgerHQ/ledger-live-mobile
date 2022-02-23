import * as testHelpers from "../helpers";

export default class PortfolioPage {
  static async porfolioIsVisible() {
    // await testHelpers.tap("Proceed");
  }

  static async navigateToSettings() {
    await testHelpers.tap("settings-icon");
  }
}
