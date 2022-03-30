// @flow

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import LText from "../../components/LText";
import CurrencyRow from "../../components/CurrencyRow";
import DropdownArrow from "../../icons/DropdownArrow";
import AccountCard from "../../components/AccountCard";

type Props = {
  title: string,
  currency: CryptoCurrency | TokenCurrency | null,
  account: Account | AccountLike | null,
  onSelectCurrency: () => void,
  onSelectAccount: () => void,
};

export default function SelectAccountCurrency({
  title,
  currency,
  account,
  onSelectCurrency,
  onSelectAccount,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.body}>
      <View
        style={[
          styles.accountAndCurrencySelect,
          { borderColor: colors.border },
        ]}
      >
        <LText secondary semiBold>
          {title}
        </LText>
        <TouchableOpacity onPress={onSelectCurrency}>
          <View style={[styles.select, { borderColor: colors.border }]}>
            {currency ? (
              <View>
                <CurrencyRow
                  currency={currency}
                  onPress={() => {}}
                  iconSize={32}
                />
              </View>
            ) : (
              <LText style={styles.placeholder}>
                {t("exchange.buy.selectCurrency")}
              </LText>
            )}
            <DropdownArrow size={10} color={colors.grey} />
          </View>
        </TouchableOpacity>
        {account && (
          <>
            <LText secondary semiBold style={styles.itemMargin}>
              {t("exchange.buy.selectAccount")}
            </LText>
            <TouchableOpacity onPress={onSelectAccount}>
              <View style={[styles.select, { borderColor: colors.border }]}>
                {account ? (
                  <AccountCard style={styles.card} account={account} />
                ) : (
                  <LText style={styles.placeholder}>
                    {t("exchange.buy.selectAccount")}
                  </LText>
                )}
                <DropdownArrow size={10} color={colors.grey} />
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  accountAndCurrencySelect: {
    width: "100%",
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  select: {
    height: 56,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 120,
    paddingVertical: 14,
    marginTop: 12,
    paddingRight: 16,
  },
  itemMargin: {
    marginTop: 40,
  },
  placeholder: {
    marginLeft: 16,
  },
  card: {
    maxWidth: "100%",
    paddingVertical: -16,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
});
