// @flow
import React, { useCallback, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import type { Account, Currency } from "@ledgerhq/live-common/lib/types";
import { useCosmosMappedDelegations } from "@ledgerhq/live-common/lib/families/cosmos/react";
import type { CosmosMappedDelegation } from "@ledgerhq/live-common/lib/families/cosmos/types";
import DelegationInfo from "../../components/DelegationInfo";
import IlluRewards from "../../components/IlluRewards";
import LText from "../../components/LText";
import { urls } from "../../config/urls";
import CounterValue from "../../components/CounterValue";
import AccountSectionLabel from "../../components/AccountSectionLabel";
import BottomModal from "../../components/BottomModal";
import colors from "../../colors";
import Trophy from "../../icons/Trophy";
import ArrowRight from "../../icons/ArrowRight";

type Props = {
  account: Account,
};

export default function AccuntBodyHeader({ account }: Props) {
  const { t } = useTranslation();
  const delegations = useCosmosMappedDelegations(account);
  const currency = getAccountCurrency(account);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onDelegate = useCallback(() => {}, []);

  const onAddDelegation = useCallback(() => {}, []);

  const onSeeMore = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  return (
    <View style={styles.root}>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

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
            RightComponent={() => <LabelRight onPress={onAddDelegation} />}
          />
          {delegations.map((delegation, i) => (
            <DelegationRow
              delegation={delegation}
              currency={currency}
              onPress={onSeeMore}
              position={
                i === 0
                  ? "first"
                  : i === delegations.length - 1
                  ? "last"
                  : "middle"
              }
            />
          ))}
        </>
      )}
    </View>
  );
}

type DrawerProps = {
  isOpen: boolean,
  onClose: () => void,
};

function Drawer({ isOpen, onClose }: DrawerProps) {
  return (
    <BottomModal
      id="InfoModal"
      style={styles.root}
      isOpened={isOpen}
      onClose={onClose}
    >
      <View />
    </BottomModal>
  );
}

type LabelRightProps = {
  onPress: () => void,
};

function LabelRight({ onPress }: LabelRightProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress}>
      <LText semiBold style={styles.actionColor}>
        {t("account.delegation.addDelegation")}
      </LText>
    </TouchableOpacity>
  );
}

type Position = "first" | "middle" | "last";

type DelegationRowProps = {
  delegation: CosmosMappedDelegation,
  currency: Currency,
  onPress: (delegation: CosmosMappedDelegation) => void,
  position: Position,
};

function DelegationRow({
  delegation,
  currency,
  onPress,
  position = "middle",
}: DelegationRowProps) {
  const { t } = useTranslation();
  const { validator, validatorAddress, formattedAmount, amount } = delegation;

  const wrapperStyle = [
    styles.row,
    styles.rowWrapper,
    position === "first"
      ? [styles.rowWrapperFirst, styles.borderBottom]
      : position === "last"
      ? styles.rowWrapperLast
      : styles.borderBottom,
  ];

  return (
    <TouchableOpacity style={wrapperStyle} onPress={() => onPress(delegation)}>
      <View style={styles.icon}>
        <Trophy size={16} color={colors.live} />
      </View>

      <View style={styles.nameWrapper}>
        <LText semiBold numberOfLines={1}>
          {validator?.name ?? validatorAddress}
        </LText>

        <View style={styles.row}>
          <LText style={styles.actionColor}>{t("common.seeMore")}</LText>
          <ArrowRight color={colors.live} size={16} />
        </View>
      </View>

      <LText semiBold>{formattedAmount}</LText>

      <LText style={styles.counterValue}>
        <CounterValue currency={currency} value={amount} />
      </LText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 16,
  },
  illustration: { alignSelf: "center", marginBottom: 16 },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  actionColor: {
    color: colors.live,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowWrapper: {
    backgroundColor: colors.white,
    padding: 16,
  },
  rowWrapperFirst: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  rowWrapperLast: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: colors.lightLive,
    marginRight: 12,
  },
  nameWrapper: {
    flex: 1,
    marginRight: 8,
  },
  counterValue: { color: colors.grey },
});
