// @flow
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";
import type { AccountLikeArray } from "@ledgerhq/live-common/lib/types";
import type { CurrentRate } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
// import { formatShort } from "@ledgerhq/live-common/lib/currencies";
import LText from "../../../components/LText";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import CurrencyIcon from "../../../components/CurrencyIcon";
import colors from "../../../colors";

const Row = ({
  data,
  // $FlowFixMe
  accounts,
}: {
  data: CurrentRate,
  accounts: AccountLikeArray,
}) => {
  const { token, supplyAPY } = data;

  // const openManageModal = useCallback(() => {
  //   const account = accounts.find(
  //     a => a.type === "TokenAccount" && a.token.id === token.id,
  //   );
  //   const parentAccount = accounts.find(a => a.parentId === a.id);
  //   if (!account) {
  //     //dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency: token }));
  //   } else {
  //     // dispatch(
  //     //   openModal("MODAL_LEND_ENABLE_INFO", {
  //     //     account,
  //     //     parentAccount,
  //     //     currency: token,
  //     //   }),
  //     // );
  //   }
  // }, [accounts, token]);

  // const grossSupply = useMemo((): string => {
  //   return formatShort(token.units[0], totalSupply);
  // }, [token, totalSupply]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((total, account) => {
      if (account.type !== "TokenAccount") return total;
      if (account.token.id !== token.id) return total;

      return total.plus(account.spendableBalance);
    }, BigNumber(0));
  }, [token.id, accounts]);

  return (
    <View style={styles.row}>
      <CurrencyIcon currency={token} size={32} />
      <View style={styles.currencySection}>
        <LText semiBold style={styles.title}>
          {token.ticker}
        </LText>
        <LText style={styles.subTitle}>
          <CurrencyUnitValue
            unit={token.units[0]}
            value={totalBalance}
            showCode
          />
        </LText>
      </View>
      <LText bold style={styles.badge}>
        <Trans
          i18nKey="transfer.lending.dashboard.apy"
          values={{ value: supplyAPY }}
        />
      </LText>
    </View>
  );
};

const Rates = ({
  rates,
  accounts,
}: {
  rates: CurrentRate[],
  accounts: AccountLikeArray,
}) => {
  return (
    <View>
      {rates.map(r => (
        <Row data={r} key={r.ctoken.id} accounts={accounts} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 8,
    marginVertical: 4,
    backgroundColor: colors.white,
    height: 70,
    borderRadius: 4,
  },
  currencySection: { paddingHorizontal: 8, flex: 1 },
  title: {
    lineHeight: 17,
    fontSize: 14,
    color: colors.darkBlue,
  },
  subTitle: {
    lineHeight: 15,
    fontSize: 12,
    color: colors.grey,
  },
  badge: {
    fontSize: 13,
    lineHeight: 24,
    color: colors.live,
    backgroundColor: colors.lightLive,
    borderRadius: 24,
    height: 24,
    paddingHorizontal: 8,
  },
});

export default Rates;
