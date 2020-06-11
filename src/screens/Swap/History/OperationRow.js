// @flow
import React from "react";
import { StyleSheet, View } from "react-native";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account/helpers";
import type { MappedSwapOperation } from "@ledgerhq/live-common/lib/swap/types";
import Icon from "react-native-vector-icons/dist/Ionicons";
import IconSwap from "../../../icons/Swap";
import LText from "../../../components/LText";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import colors, { rgba } from "../../../colors";

const getStatusColor = status => {
  return (
    {
      finished: colors.green,
      new: colors.grey,
      failed: colors.alert,
    }[status] || colors.grey
  );
};

const OperationRow = ({ item }: { item: MappedSwapOperation }) => {
  const {
    swapId,
    provider,
    fromAccount,
    toAccount,
    fromAmount,
    toAmount,
    status,
  } = item;
  const statusColor = getStatusColor(status);

  return (
    <View style={styles.root}>
      <View
        style={[styles.status, { backgroundColor: rgba(statusColor, 0.1) }]}
      >
        <IconSwap color={statusColor} size={16} />
      </View>
      <View style={styles.accountWrapper}>
        <LText numberOfLines={1} semiBold style={styles.name}>
          {fromAccount.name}
        </LText>
        <LText tertiary style={styles.amount}>
          <CurrencyUnitValue
            showCode
            unit={getAccountUnit(fromAccount)}
            value={fromAmount}
          />
        </LText>
      </View>
      <View style={styles.arrow}>
        <Icon name={"ios-arrow-round-forward"} size={30} color={colors.grey} />
      </View>
      <View style={[styles.accountWrapper, { alignItems: "flex-end" }]}>
        <LText numberOfLines={1} semiBold style={styles.name}>
          {toAccount.name}
        </LText>
        <LText tertiary style={styles.amount}>
          <CurrencyUnitValue
            showCode
            unit={getAccountUnit(toAccount)}
            value={toAmount}
          />
        </LText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    backgroundColor: colors.white,
    borderBottomColor: colors.lightFog,
    borderBottomWidth: 1,
  },
  arrow: {
    flexShrink: 0,
    flexGrow: 1,
    marginLeft: 16,
    marginRight: 16,
    alignItems: "center",
  },
  status: {
    height: 38,
    width: 38,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  name: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 19,
    color: colors.black,
    marginBottom: 2,
  },
  amount: {
    fontSize: 13,
    lineHeight: 15,
    color: colors.grey,
  },
  accountWrapper: {
    flexShrink: 1,
  },
});

export default OperationRow;
