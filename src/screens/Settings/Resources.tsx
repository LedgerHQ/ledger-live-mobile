import React from "react";
import { Linking } from "react-native";
import { useTranslation } from "react-i18next";
import {
  NanoSFoldedMedium,
  LifeRingMedium,
  FacebookMedium,
  TwitterMedium,
  GithubMedium,
  ActivityMedium,
} from "@ledgerhq/native-ui/assets/icons";
import SettingsNavigationScrollView from "./SettingsNavigationScrollView";
import SettingsCard from "../../components/SettingsCard";

const Resources = () => {
  const { t } = useTranslation();

  return (
    <SettingsNavigationScrollView>
      <SettingsCard
        title={t("help.gettingStarted.title")}
        desc={t("help.gettingStarted.desc")}
        Icon={NanoSFoldedMedium}
        onClick={() =>
          Linking.openURL(
            "https://www.ledger.com/academy/?utm_source=ledger_live&utm_medium=self_referral&utm_content=help_mobile",
          )
        }
      />
      <SettingsCard
        title={t("help.helpCenter.title")}
        desc={t("help.helpCenter.desc")}
        Icon={LifeRingMedium}
        onClick={() =>
          Linking.openURL(
            "https://www.ledger.com/start?utm_source=ledger_live&utm_medium=self_referral&utm_content=help_mobile",
          )
        }
      />

      <SettingsCard
        title={t("help.ledgerAcademy.title")}
        desc={t("help.ledgerAcademy.desc")}
        Icon={LifeRingMedium}
        onClick={() =>
          Linking.openURL(
            "https://support.ledger.com/hc/en-us?utm_source=ledger_live&utm_medium=self_referral&utm_content=help_mobile",
          )
        }
      />

      <SettingsCard
        title={t("help.facebook.title")}
        desc={t("help.facebook.desc")}
        Icon={FacebookMedium}
        onClick={() => Linking.openURL("https://facebook.com/Ledger")}
      />

      <SettingsCard
        title={t("help.twitter.title")}
        desc={t("help.twitter.desc")}
        Icon={TwitterMedium}
        onClick={() => Linking.openURL("https://twitter.com/Ledger")}
      />

      <SettingsCard
        title={t("help.github.title")}
        desc={t("help.github.desc")}
        Icon={GithubMedium}
        onClick={() => Linking.openURL("https://github.com/LedgerHQ")}
      />
      <SettingsCard
        title={t("help.status.title")}
        desc={t("help.status.desc")}
        Icon={ActivityMedium}
        onClick={() => Linking.openURL("https://status.ledger.com")}
      />
    </SettingsNavigationScrollView>
  );
};

export default Resources;
