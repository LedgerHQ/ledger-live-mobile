// @flow

import React from "react";
import { View, StyleSheet } from "react-native";
import { getAccountName } from "@ledgerhq/live-common/lib/account";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
// import { getAccountCapabilities } from "@ledgerhq/live-common/lib/compound/logic";
import LText from "../../../components/LText";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import CurrencyIcon from "../../../components/CurrencyIcon";
import CounterValue from "../../../components/CounterValue";
import colors from "../../../colors";

type RowProps = {
  summary: CompoundAccountSummary,
};

const Row = ({ summary }: RowProps) => {
  const { account, parentAccount, totalSupplied } = summary;
  const { token } = account;
  const name = getAccountName(account);
  // const capabilities = getAccountCapabilities(account);
  //
  // const openManageModal = useCallback(() => {
  //   // dispatch(openModal("MODAL_LEND_MANAGE", { ...summary }));
  // }, [summary]);

  // END HACK

  return (
    <View style={styles.row}>
      <CurrencyIcon currency={token} size={32} />
      <View style={styles.currencySection}>
        <LText semiBold style={styles.subTitle}>
          {parentAccount?.name}
        </LText>
        <LText style={styles.title}>{name}</LText>
      </View>
      <View style={[styles.currencySection, styles.alignEnd]}>
        <LText>
          <CurrencyUnitValue
            unit={token.units[0]}
            value={totalSupplied}
            showCode
          />
        </LText>
        <LText>
          <CounterValue
            currency={token}
            value={totalSupplied}
            disableRounding
            fontSize={3}
            showCode
            alwaysShowSign={false}
          />
        </LText>
      </View>
    </View>
  );
};

type Props = {
  summaries: CompoundAccountSummary[],
};

const ActiveAccounts = ({ summaries }: Props) => {
  return (
    <View style={styles.root}>
      {summaries.map((s, i) => (
        <>
          {i > 0 && <View style={styles.separator} />}
          <Row key={s.account.id} summary={s} />
        </>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.lightGrey,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 8,
    height: 70,
  },
  currencySection: { paddingHorizontal: 8, flex: 1 },
  alignEnd: {
    alignItems: "flex-end",
  },
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
});

export default ActiveAccounts;
