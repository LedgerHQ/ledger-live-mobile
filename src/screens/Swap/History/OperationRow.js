// @flow
import React, { useCallback } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account/helpers";
import type { MappedSwapOperation } from "@ledgerhq/live-common/lib/swap/types";
import Icon from "react-native-vector-icons/dist/Ionicons";

import LText from "../../../components/LText";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import colors from "../../../colors";
import { ScreenName } from "../../../const";
import SwapStatusIndicator from "../SwapStatusIndicator";

const OperationRow = ({ item }: { item: MappedSwapOperation }) => {
  const { swapId, fromAccount, toAccount, fromAmount, toAmount, status } = item;
  const navigation = useNavigation();

  const onOpenOperationDetails = useCallback(() => {
    navigation.navigate(ScreenName.SwapOperationDetails, {
      swapOperation: item,
    });
  }, [item, navigation]);

  return (
    <TouchableOpacity key={swapId} onPress={onOpenOperationDetails}>
      <View style={styles.root}>
        <SwapStatusIndicator small status={status} />
        <View style={[styles.accountWrapper, { marginLeft: 18 }]}>
          <LText numberOfLines={1} semiBold style={styles.name}>
            {getAccountName(fromAccount)}
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
          <Icon name={"ios-arrow-round-forward"} size={30} color={colors.fog} />
        </View>
        <View style={[styles.accountWrapper, { alignItems: "flex-end" }]}>
          <LText numberOfLines={1} semiBold style={styles.name}>
            {getAccountName(toAccount)}
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
    </TouchableOpacity>
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
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    alignItems: "center",
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
    width: "35%",
  },
});

export default OperationRow;
