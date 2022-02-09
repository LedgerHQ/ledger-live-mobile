import React, { useCallback } from "react";
import { FlatList } from "react-native";
import type {
    CryptoCurrency,
    TokenCurrency,
} from "@ledgerhq/live-common/lib/types/currencies";
import styled from "styled-components/native";
import { Flex, Text } from "@ledgerhq/native-ui";
import Delta from "../../components/Delta";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import CounterValue from "../../components/CounterValue";
import ParentCurrencyIcon from "../../components/ParentCurrencyIcon";

type DistributionItem = {
  currency: CryptoCurrency | TokenCurrency;
  distribution: number; // % of the total (normalized in 0-1)
  amount: number;
  countervalue: number; // countervalue of the amount that was calculated based of the rate provided
};

type AssetRowProps = {
    item: DistributionItem,
};

const AssetRowContainer = styled(Flex).attrs({
    paddingBottom: 5,
    paddingTop: 5,
  })``;

const AssetRow = ({ item: { currency, amount, distribution } }: AssetRowProps) => {
    console.log()
    return (
        <AssetRowContainer flexDirection="row">
            <Flex borderWidth={2} borderRadius={100} borderColor={currency.color} padding={2} mr={6}>
                <ParentCurrencyIcon currency={currency} size={32} />
            </Flex>
            <Flex flex={1}>
                <Flex flexDirection="row" justifyContent="space-between">
                    <Text variant="large" fontWeight="semiBold" color="neutral.c100">
                        {currency.name}
                    </Text>
                    <Text variant="large" fontWeight="semiBold" color="neutral.c100">
                        <CounterValue
                            currency={currency}
                            value={amount}
                            joinFragmentsSeparator=""
                        />
                    </Text>
                </Flex>
                <Flex flexDirection="row" justifyContent="space-between">
                    <Text variant="body" fontWeight="medium" color="neutral.c70">
                        <CurrencyUnitValue
                            unit={currency.units[0]}
                            value={amount}
                            joinFragmentsSeparator=""
                        />
                    </Text>
                    <Delta percent valueChange={10} />
                </Flex>
            </Flex>
        </AssetRowContainer>
    );
};
  

type ListProps = {
  flatListRef: Function;
  distribution: any;
};

const AssetsList = ({ flatListRef, distribution }: ListProps) => {
  const renderItem = useCallback(
    ({ item }: { item: DistributionItem }) => <AssetRow item={item} />,
    [],
  );
  console.log('---------------------')
  console.log(distribution.list[0].currency)
  console.log('---------------------')

  return (
    <FlatList
      // $FlowFixMe
      ref={flatListRef}
      data={distribution.list}
      renderItem={renderItem}
      keyExtractor={item => item.currency.id}
      contentContainerStyle={{ flex: 1 }}
    />
  );
};

export default AssetsList;