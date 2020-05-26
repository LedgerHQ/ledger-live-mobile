// @flow
import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { useCosmosMappedDelegations } from "@ledgerhq/live-common/lib/families/cosmos/react";
import type { Account } from "@ledgerhq/live-common/lib/types";
import DelegationInfo from "../../../components/DelegationInfo";
import IlluRewards from "../../../components/IlluRewards";
import { urls } from "../../../config/urls";
import AccountSectionLabel from "../../../components/AccountSectionLabel";
import colors from "../../../colors";
import { ScreenName, NavigatorName } from "../../../const";
import DelegationRow from "./Row";
import DelegationDrawer from "./Drawer";
import DelegationLabelRight from "./LabelRight";

type Props = {
  account: Account,
};

export default function Deleagations({ account }: Props) {
  const { t } = useTranslation();
  const delegations = useCosmosMappedDelegations(account);
  const currency = getAccountCurrency(account);
  const navigation = useNavigation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onDelegate = useCallback(() => {
    // TODO: check destination and params.
    // TODO: check whether onDelegate and onAddDelegation are the same or not
    navigation.navigate(NavigatorName.CosmosDelegationFlow, {
      screen: ScreenName.DelegationSelectValidator,
      params: {
        account,
      },
    });
  }, [navigation, account]);

  const onSeeMore = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <View style={styles.root}>
      <DelegationDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer} />

      {delegations.length === 0 ? (
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
      ) : (
        <>
          <AccountSectionLabel
            name={t("account.delegation.sectionLabel")}
            RightComponent={() => <DelegationLabelRight onPress={onDelegate} />}
          />
          {delegations.map((d, i) => (
            <View style={styles.delegationsWrapper}>
              <DelegationRow
                delegation={d}
                currency={currency}
                onPress={onSeeMore}
                isLast={i === delegations.length - 1}
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    margin: 16,
  },
  illustration: { alignSelf: "center", marginBottom: 16 },
  delegationsWrapper: {
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  actionColor: {
    color: colors.live,
  },
});
