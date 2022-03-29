import { device } from "detox";
import { loadConfig } from "../bridge/server";
import PortfolioPage from "../models/portfolioPage";
import SettingsPage from "../models/settings/settingsPage";
import GeneralSettingsPage from "../models/settings/generalSettingsPage";
import PasswordEntryPage from "../models/passwordEntryPage";
import { delay } from "../helpers";

const CORRECT_PASSWORD = "passWORD$123!";

describe("Password Lock Screen", () => {
  beforeAll(async () => {
    console.log("==============> STARTING PASSWORD DEVICE LAUNCH");
    await device.launchApp({ newInstance: false });
    // await device.reloadReactNative();
  });

  it("should be able to enter the correct password", async () => {
    console.log("==============> STARTING PASSWORD TEST");
    await loadConfig("1AccountBTC1AccountETH", true);

    await PortfolioPage.waitForPageToBeVisible();
    await PortfolioPage.navigateToSettings();
    await SettingsPage.navigateToGeneralSettings();
    await GeneralSettingsPage.togglePassword();
    await GeneralSettingsPage.enterNewPassword(CORRECT_PASSWORD);
    await GeneralSettingsPage.enterNewPassword(CORRECT_PASSWORD); // confirm password step

    await device.sendToHome();
    await delay(60001); // password takes 60 seconds of app inactivity to activate
    await device.launchApp();

    await PasswordEntryPage.enterPassword(CORRECT_PASSWORD);
    await PasswordEntryPage.login();

    await GeneralSettingsPage.isVisible();
  });
});
