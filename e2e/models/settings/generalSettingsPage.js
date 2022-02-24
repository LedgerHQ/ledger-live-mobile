import * as testHelpers from "../../helpers";

export default class GeneralSettingsPage {
  static async togglePassword() {
    await testHelpers.scrollToElementById(
      "password-settings-toggle",
      "general-settings-scroll-view",
      200,
    );

    await testHelpers.tap("password-settings-toggle");
  }

  static async enterNewPassword(passwordText) {
    await testHelpers.typeText("password-text-input", passwordText);
    await testHelpers.tap("Proceed");
  }

  static async isVisible() {
    await testHelpers.verifyTextIsVisible("General");
  }
}
