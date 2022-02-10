import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
import styled, { useTheme } from "styled-components/native";
import { Flex, Text, ProgressLoader } from "@ledgerhq/native-ui";
<<<<<<< HEAD
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import {
  getAccountCurrency,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import { BalanceHistory } from "@ledgerhq/live-common/lib/types";
import { useCalculate } from "@ledgerhq/live-common/lib/countervalues/react";
import { counterValueCurrencySelector } from "../../reducers/settings";
=======
>>>>>>> fafa1242 (LIVE-230 Assets Row in progress)
import Delta from "../../components/Delta";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import CounterValue from "../../components/CounterValue";
import ParentCurrencyIcon from "../../components/ParentCurrencyIcon";
import { ensureContrast } from "../../colors";
<<<<<<< HEAD
import { useBalanceHistoryWithCountervalue } from "../../actions/portfolio";

type AssetRowProps = {
  item: any;
  portfolioValue: number;
=======
import {
    getAccountCurrency,
    getAccountName,
  } from "@ledgerhq/live-common/lib/account";

import { useBalanceHistoryWithCountervalue } from "../../actions/portfolio";
  type AssetRowProps = {
  item: any;
>>>>>>> fafa1242 (LIVE-230 Assets Row in progress)
};

const AssetRowContainer = styled(Flex).attrs({
  paddingBottom: 5,
  paddingTop: 5,
})``;

<<<<<<< HEAD
const AssetRow = ({ item, portfolioValue }: AssetRowProps) => {
=======
const AssetRow = ({ item }: AssetRowProps) => {
>>>>>>> fafa1242 (LIVE-230 Assets Row in progress)
  const { colors } = useTheme();
  const currency = getAccountCurrency(item);
  const color = useMemo(
    () => ensureContrast(getCurrencyColor(currency), colors.background.main),
    [colors, currency],
  );
  const accountName = getAccountName(item);
  const range = "day";
<<<<<<< HEAD
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

  console.log(countervalue, portfolioValue, portfolioPercentage);

=======
  const {
    countervalueAvailable,
    countervalueChange,
    cryptoChange,
    history,
  } = useBalanceHistoryWithCountervalue({ account: item, range });

>>>>>>> fafa1242 (LIVE-230 Assets Row in progress)
  return (
    <AssetRowContainer flexDirection="row">
      <Flex mr={6}>
        <ProgressLoader
          strokeWidth={2}
          mainColor={color}
<<<<<<< HEAD
          progress={portfolioPercentage}
=======
          progress={0.33}
>>>>>>> fafa1242 (LIVE-230 Assets Row in progress)
          radius={23}
        >
          <ParentCurrencyIcon currency={currency} size={32} />
        </ProgressLoader>
      </Flex>
      <Flex flex={1}>
        <Flex flexDirection="row" justifyContent="space-between">
<<<<<<< HEAD
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
=======
          <Text variant="large" fontWeight="semiBold" color="neutral.c100">
            {accountName}
          </Text>
          <Text variant="large" fontWeight="semiBold" color="neutral.c100">
            <CounterValue
              currency={currency}
              value={countervalueAvailable}
              joinFragmentsSeparator=""
            />
          </Text>
>>>>>>> fafa1242 (LIVE-230 Assets Row in progress)
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between">
          <Text variant="body" fontWeight="medium" color="neutral.c70">
            <CurrencyUnitValue
              unit={currency.units[0]}
<<<<<<< HEAD
              value={item.balance}
              joinFragmentsSeparator=""
            />
          </Text>
          <Delta percent valueChange={countervalueChange} />
=======
              value={countervalueAvailable}
              joinFragmentsSeparator=""
            />
          </Text>
          <Delta percent valueChange={cryptoChange} />
>>>>>>> fafa1242 (LIVE-230 Assets Row in progress)
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

<<<<<<< HEAD
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
=======
const AssetsList = ({ flatListRef, assets }: ListProps) => {
  const renderItem = useCallback(
    ({ item }: { item: any }) => <AssetRow item={item} />,
    [],
>>>>>>> fafa1242 (LIVE-230 Assets Row in progress)
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
