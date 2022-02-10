import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
import styled, { useTheme } from "styled-components/native";
import { Flex, Text, ProgressLoader } from "@ledgerhq/native-ui";
import Delta from "../../components/Delta";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import CounterValue from "../../components/CounterValue";
import ParentCurrencyIcon from "../../components/ParentCurrencyIcon";
import { ensureContrast } from "../../colors";
import {
    getAccountCurrency,
    getAccountName,
  } from "@ledgerhq/live-common/lib/account";

import { useBalanceHistoryWithCountervalue } from "../../actions/portfolio";
  type AssetRowProps = {
  item: any;
};

const AssetRowContainer = styled(Flex).attrs({
  paddingBottom: 5,
  paddingTop: 5,
})``;

const AssetRow = ({ item }: AssetRowProps) => {
  const { colors } = useTheme();
  const currency = getAccountCurrency(item);
  const color = useMemo(
    () => ensureContrast(getCurrencyColor(currency), colors.background.main),
    [colors, currency],
  );
  const accountName = getAccountName(item);
  const range = "day";
  const {
    countervalueAvailable,
    countervalueChange,
    cryptoChange,
    history,
  } = useBalanceHistoryWithCountervalue({ account: item, range });

  return (
    <AssetRowContainer flexDirection="row">
      <Flex mr={6}>
        <ProgressLoader
          strokeWidth={2}
          mainColor={color}
          progress={0.33}
          radius={23}
        >
          <ParentCurrencyIcon currency={currency} size={32} />
        </ProgressLoader>
      </Flex>
      <Flex flex={1}>
        <Flex flexDirection="row" justifyContent="space-between">
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
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between">
          <Text variant="body" fontWeight="medium" color="neutral.c70">
            <CurrencyUnitValue
              unit={currency.units[0]}
              value={countervalueAvailable}
              joinFragmentsSeparator=""
            />
          </Text>
          <Delta percent valueChange={cryptoChange} />
        </Flex>
      </Flex>
    </AssetRowContainer>
  );
};

type ListProps = {
  flatListRef: Function;
  assets: any;
};

const AssetsList = ({ flatListRef, assets }: ListProps) => {
  const renderItem = useCallback(
    ({ item }: { item: any }) => <AssetRow item={item} />,
    [],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={assets}
      renderItem={renderItem}
      keyExtractor={item => item.currency.id}
      contentContainerStyle={{ flex: 1 }}
    />
  );
};

export default AssetsList;
