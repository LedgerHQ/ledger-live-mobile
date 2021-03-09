/* @flow */
import React from "react";
import { View, StyleSheet } from "react-native";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { Trans } from "react-i18next";
import { getAccountCapabilities } from "@ledgerhq/live-common/lib/compound/logic";

import { useSelector } from "react-redux";
import { useLocale } from "../../context/Locale";
import LText from "../../components/LText";
import InfoBox from "../../components/InfoBox";
import WarningBox from "../../components/WarningBox";
import { discreetModeSelector } from "../../reducers/settings";

type Props = {
  account: AccountLike,
};

export default function LendingBanners({ account }: Props) {
  const { locale } = useLocale();
  const discreet = useSelector(discreetModeSelector);
  const unit = getAccountUnit(account);

  const availableOnCompound =
    account.type === "TokenAccount" && !!account.compoundBalance;
  const compoundCapabilities = availableOnCompound
    ? getAccountCapabilities(account)
    : {};

  let lendingInfoBanner = null;

  if (availableOnCompound && compoundCapabilities) {
    const lendingInfoBannerContent = !compoundCapabilities.status ? (
      <Trans i18nKey="transfer.lending.banners.needApproval" />
    ) : compoundCapabilities.enabledAmountIsUnlimited ? (
      <Trans i18nKey="transfer.lending.banners.fullyApproved" />
    ) : !!compoundCapabilities.status &&
      compoundCapabilities.enabledAmount.gt(0) &&
      compoundCapabilities.canSupplyMax ? (
      <Trans
        i18nKey="transfer.lending.banners.approvedCanReduce"
        values={{
          value: formatCurrencyUnit(unit, compoundCapabilities.enabledAmount, {
            locale,
            showAllDigits: false,
            disableRounding: true,
            showCode: true,
            discreet,
          }),
        }}
      >
        <LText semiBold />
      </Trans>
    ) : compoundCapabilities.enabledAmount.gt(0) ? (
      <Trans
        i18nKey="transfer.lending.banners.approvedButNotEnough"
        values={{
          value: formatCurrencyUnit(unit, compoundCapabilities.enabledAmount, {
            locale,
            showAllDigits: false,
            disableRounding: true,
            showCode: true,
            discreet,
          }),
        }}
      >
        <LText semiBold />
      </Trans>
    ) : null;

    if (lendingInfoBannerContent) {
      lendingInfoBanner = (
        <View style={styles.bannerBox} key="infoBanner">
          <InfoBox>{lendingInfoBannerContent}</InfoBox>
        </View>
      );
    }
  }

  let lendingWarningBanner = null;

  if (availableOnCompound && compoundCapabilities) {
    const lendingWarningBannerContent =
      compoundCapabilities.status === "ENABLING" ? (
        <Trans i18nKey="transfer.lending.banners.approving" />
      ) : !!compoundCapabilities.status &&
        !compoundCapabilities.canSupplyMax ? (
        <Trans i18nKey="transfer.lending.banners.notEnough" />
      ) : null;

    if (lendingWarningBannerContent) {
      lendingWarningBanner = (
        <View style={styles.bannerBox} key="warningBanner">
          <WarningBox>{lendingWarningBannerContent}</WarningBox>
        </View>
      );
    }
  }

  return [lendingInfoBanner, lendingWarningBanner];
}

const styles = StyleSheet.create({
  bannerBox: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
});
