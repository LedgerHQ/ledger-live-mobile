import * as testHelpers from "../helpers";

export default class GeneralSettingsPage {
  static async navigateToGeneralSettings() {
    await testHelpers.tap("general-settings-card");
  }
}
