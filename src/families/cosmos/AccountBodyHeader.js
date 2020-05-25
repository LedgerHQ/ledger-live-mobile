// @flow
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { useCosmosMappedDelegations } from "@ledgerhq/live-common/lib/families/cosmos/react";
import DelegationInfo from "../../components/DelegationInfo";
import IlluRewards from "../../components/IlluRewards";
import { urls } from "../../config/urls";

type Props = {
  account: Account,
};

export default function AccuntBodyHeader({ account }: Props) {
  const { t } = useTranslation();
  const delegations = useCosmosMappedDelegations(account);

  const onDelegate = useCallback(() => {}, []);

  if (delegations.length === 0) {
    return (
      <View style={styles.root}>
        <DelegationInfo
          title={t("account.delegation.info.title")}
          image={<IlluRewards style={styles.illustration} />}
          description={t("tron.voting.delegationEarn", {
            name: account.currency.name,
          })}
          infoUrl={urls.tronStaking}
          infoTitle={t("tron.voting.howItWorks")}
          onPress={onDelegate}
          ctaTitle={t("account.delegation.info.cta")}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {delegations.map(({}) => (
        <View></View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 16,
  },
  illustration: { alignSelf: "center", marginBottom: 16 },
});
