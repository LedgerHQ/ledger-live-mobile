import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
import styled, { useTheme } from "styled-components/native";
// TODO : replace by { Flex, Text, ProgressLoader } when ProgressLoader exported from ui
import { Flex, Text, Loader as ProgressLoader } from "@ledgerhq/native-ui";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import {
  getAccountCurrency,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import { BalanceHistory } from "@ledgerhq/live-common/lib/types";
import { useCalculate } from "@ledgerhq/live-common/lib/countervalues/react";
import { counterValueCurrencySelector } from "../../reducers/settings";
import Delta from "../../components/Delta";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import CounterValue from "../../components/CounterValue";
import ParentCurrencyIcon from "../../components/ParentCurrencyIcon";
import { ensureContrast } from "../../colors";
import { useBalanceHistoryWithCountervalue } from "../../actions/portfolio";

type AssetRowProps = {
  item: any;
  portfolioValue: number;
};

const AssetRowContainer = styled(Flex).attrs({
  paddingBottom: 5,
  paddingTop: 5,
})``;

const AssetRow = ({ item, portfolioValue }: AssetRowProps) => {
  const { colors } = useTheme();
  const currency = getAccountCurrency(item);
  const color = useMemo(
    () => ensureContrast(getCurrencyColor(currency), colors.background.main),
    [colors, currency],
  );
  const accountName = getAccountName(item);
  const range = "day";
  const { countervalueChange } = useBalanceHistoryWithCountervalue({
    account: item,
    range,
  });

  const counterValueCurrency = useSelector(counterValueCurrencySelector);

  const countervalue = useCalculate({
    from: currency,
    to: counterValueCurrency,
    value:
      item.balance instanceof BigNumber
        ? item.balance.toNumber()
        : item.balance,
    disableRounding: true,
  });

  const portfolioPercentage = useMemo(
    () => (countervalue ? countervalue / portfolioValue : 0),
    [countervalue, portfolioValue],
  );

  return (
    <AssetRowContainer flexDirection="row">
      <Flex mr={6}>
        <ProgressLoader
          strokeWidth={2}
          mainColor={color}
          progress={portfolioPercentage}
          radius={23}
        >
          <ParentCurrencyIcon currency={currency} size={32} />
        </ProgressLoader>
      </Flex>
      <Flex flex={1}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex alignItems="flex-start" flex={1}>
            <Text
              variant="large"
              fontWeight="semiBold"
              color="neutral.c100"
              numberOfLines={1}
            >
              {accountName}
            </Text>
          </Flex>
          <Flex alignItems="flex-end" flexShrink={0} pl={3}>
            <Text variant="large" fontWeight="semiBold" color="neutral.c100">
              <CounterValue
                currency={currency}
                value={item.balance}
                joinFragmentsSeparator=""
              />
            </Text>
          </Flex>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between">
          <Text variant="body" fontWeight="medium" color="neutral.c70">
            <CurrencyUnitValue
              unit={currency.units[0]}
              value={item.balance}
              joinFragmentsSeparator=""
            />
          </Text>
          <Delta percent valueChange={countervalueChange} />
        </Flex>
      </Flex>
    </AssetRowContainer>
  );
};

type ListProps = {
  balanceHistory: BalanceHistory;
  flatListRef: Function;
  assets: any;
};

const AssetsList = ({ balanceHistory, flatListRef, assets }: ListProps) => {
  const portfolioValue = useMemo(
    () => balanceHistory[balanceHistory.length - 1].value,
    [balanceHistory],
  );
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <AssetRow item={item} portfolioValue={portfolioValue} />
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
