/* @flow */
import React, { useState, useCallback } from "react";
import Icon from "react-native-vector-icons/dist/FontAwesome5Pro";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  getMainAccount,
  getAccountUnit,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";
import { useTheme } from "@react-navigation/native";

import type {
  Account,
  AccountLike,
  Transaction,
} from "@ledgerhq/live-common/lib/types";
import LText from "../../../components/LText";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import CounterValue from "../../../components/CounterValue";
import SectionSeparator from "../../../components/SectionSeparator";
import { rgba } from "../../../colors";
//import LText from "./LText";
//import SummaryRow from "../screens/SendFunds/SummaryRow";
//import CounterValue from "./CounterValue";
//import CurrencyUnitValue from "./CurrencyUnitValue";

//import SectionSeparator from "./SectionSeparator";
//import BottomModal from "./BottomModal";
//import Info from "../icons/Info";
//import NetworkFeeInfo from "./NetworkFeeInfo";

type Props = {
  strategies: any,
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  onStrategySelect: Function,
  onCustomFeesPress: Function,
  forceUnitLabel?: *,
};

const CVWrapper = ({ children }: { children: * }) => (
  <LText semiBold color="grey">
    {children}
  </LText>
);

export default function SelectFeesStrategy({
  strategies,
  account,
  parentAccount,
  transaction,
  onStrategySelect,
  onCustomFeesPress,
  forceUnitLabel,
}: Props) {
  const { t } = useTranslation();
  console.log("used transac,", transaction);
  const { colors } = useTheme();
  const mainAccount = getMainAccount(account, parentAccount);
  const currency = getAccountCurrency(mainAccount);
  const unit = getAccountUnit(mainAccount);
  const { feesStrategy } = transaction;

  const onPressStrategySelect = useCallback(
    (item: any) => {
      onStrategySelect({
        amount: item.amount,
        label: item.forceValueLabel ?? item.label,
        userGasLimit: item.userGasLimit,
      });
    },
    [onStrategySelect],
  );

  const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => onPressStrategySelect(item)}
        style={[
          styles.feeButton,
          {
            borderColor:
              feesStrategy === item.label
                ? colors.live
                : rgba(colors.contrastBackground, 0.1),
          },
        ]}
      >
        <View style={styles.feeStrategyContainer}>
          <View style={styles.leftBox}>
            <Icon
              size={16}
              color={
                feesStrategy === item.label
                  ? colors.live
                  : rgba(colors.contrastBackground, 0.5)
              }
              name={"tachometer-alt-fastest"}
            />
            <LText
              bold
              style={[
                styles.feeLabel,
                {
                  color:
                    feesStrategy === item.label
                      ? colors.live
                      : rgba(colors.contrastBackground, 0.5),
                },
              ]}
            >
              {t(`fees.speed.${item.label}`)}
            </LText>
          </View>
          <View style={styles.feesAmountContainer}>
            <LText semiBold style={styles.feesAmount}>
              <CurrencyUnitValue
                showCode={!forceUnitLabel}
                unit={item.unit ?? unit}
                value={item.displayedAmount ?? item.amount}
              />
              {forceUnitLabel ? " " : null}
              {forceUnitLabel || null}
            </LText>
            {item.displayedAmount ? (
              <CounterValue
                currency={currency}
                showCode
                value={item.displayedAmount}
                alwaysShowSign={false}
                withPlaceholder
                Wrapper={CVWrapper}
              />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
  );

  return (
    <>
      <View>
        <SafeAreaView>
          <FlatList
            data={strategies}
            renderItem={renderItem}
            keyExtractor={s => s.label}
            extraData={feesStrategy}
          />
        </SafeAreaView>
        <TouchableOpacity
          style={[
            styles.customizeFeesButton,
            { backgroundColor: colors.lightLive },
          ]}
          onPress={onCustomFeesPress}
        >
          <LText semiBold color="live">
            {t("send.summary.customizeFees")}
          </LText>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  strategiesContainer: {
    flex: 1,
    backgroundColor: "red",
  },
  leftBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  feeStrategyContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feesAmountContainer: {
    alignItems: "flex-end",
  },
  feeButton: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  feeLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 10,
  },
  feesAmount: { fontSize: 15 },
  checkbox: {
    borderRadius: 24,
    width: 20,
    height: 20,
  },
  customizeFeesButton: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  text: {
    color: "red",
  },
});
