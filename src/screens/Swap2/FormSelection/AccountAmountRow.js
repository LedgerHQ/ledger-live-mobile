// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import type {
  Exchange,
  SwapTransaction,
} from "@ledgerhq/live-common/lib/exchange/swap/types";

import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import LText from "../../../components/LText";
import AccountSelect from "./AccountSelect";

type Props = {
  navigation: *,
  exchange: Exchange,
  onChange: (value: Exchange) => void,
  transaction: SwapTransaction,
  onUpdateTransaction: (transaction: SwapTransaction) => void,
};

export default function AccountAmountRow({
  navigation,
  exchange,
  onChange,
  transaction,
  onUpdateTransaction,
}: Props) {
  const { colors } = useTheme();
  const { fromAccount, fromParentAccount, toAccount, toParentAccount } = exchange;

  return (
    <View>
      <View>
        <LText semiBold color="grey" style={styles.label}>
          <Trans i18nKey="transfer.swap.form.from" />
        </LText>
        <View style={styles.root}>
          <AccountSelect
            exchange={exchange}
            navigation={navigation}
            target="from"
          />
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.fog }]} />
      <View>
        <LText semiBold color="grey" style={styles.label}>
          <Trans i18nKey="transfer.swap.form.to" />
        </LText>
        <View style={styles.root}>
          <AccountSelect
            exchange={exchange}
            navigation={navigation}
            target="to"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    paddingVertical: 16,
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    marginVertical: 16,
  },
});
