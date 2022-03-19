import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { BalanceHistory } from "@ledgerhq/live-common/lib/types";
import { useNavigation } from "@react-navigation/native";
import AccountRow from "../Accounts/AccountRow";

type ListProps = {
  balanceHistory: BalanceHistory;
  flatListRef: Function;
  assets: any;
};

const AssetsList = ({ balanceHistory, flatListRef, assets }: ListProps) => {
  const navigation = useNavigation();
  const portfolioValue = useMemo(
    () => balanceHistory[balanceHistory.length - 1].value,
    [balanceHistory],
  );
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <AccountRow
        navigation={navigation}
        account={item}
        accountId={item.id}
        portfolioValue={portfolioValue}
      />
    ),
    [portfolioValue],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={assets}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={{ flex: 1 }}
    />
  );
};

export default AssetsList;
