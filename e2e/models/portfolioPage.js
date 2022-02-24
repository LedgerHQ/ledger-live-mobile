import * as testHelpers from "../helpers";

export default class PortfolioPage {
  static async navigateToSettings() {
    await testHelpers.tap("settings-icon");
  }

  static async emptyPortfolioIsVisible() {
    await testHelpers.verifyTextIsVisible("Install an app on my device");
  }
}
