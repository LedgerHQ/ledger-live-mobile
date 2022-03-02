import React, { useCallback, useEffect, useState } from "react";
import { Flex } from "@ledgerhq/native-ui";
import { FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useMarketData } from "@ledgerhq/live-common/lib/market/MarketDataProvider";
import { CurrencyData } from "@ledgerhq/live-common/lib/market/types";
import { NavigatorName, ScreenName } from "../../const";
import { useLocale } from "../../context/Locale";
import { useProviders } from "../Swap/SwapEntry";
import MarketRowItem from "../Market/MarketRowItem";
import Placeholder from "../../components/Placeholder";

function getTopGainers(
  coins: CurrencyData[] | undefined = [],
  n: number,
): CurrencyData[] {
  return [...coins]
    .sort((a, b) => b.priceChangePercentage - a.priceChangePercentage)
    .slice(0, n);
}

export default function MarketSection() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { locale } = useLocale();
  const [topGainers, setTopGainers] = useState<CurrencyData[] | undefined>();

  useProviders();

  const {
    refresh,
    counterCurrency,
    marketData,
    selectCurrency,
  } = useMarketData();

  useEffect(() => {
    if (!topGainers && marketData?.length) {
      setTopGainers(getTopGainers(marketData, 3));
      refresh({ limit: 20 });
    }
  }, [marketData]);

  const renderItems = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        onPress={() => {
          selectCurrency(item.id);
          navigation.navigate(NavigatorName.Market, {
            screen: ScreenName.MarketDetail,
            params: {
              currencyId: item.id,
            },
          });
        }}
      >
        <MarketRowItem
          item={item}
          index={index}
          counterCurrency={counterCurrency}
          locale={locale}
          t={t}
        />
      </TouchableOpacity>
    ),
    [counterCurrency, locale, navigation, selectCurrency, t],
  );

  const renderEmptyComponent = useCallback(
    () => (
      <Flex>
        {Array.from({ length: 3 }, (_, key) => (
          <Flex key={key} py={5}>
            <Flex flexDirection={"row"} justifyContent={"space-between"} mb={2}>
              <Placeholder width={230} containerHeight={20} />
              <Placeholder width={70} containerHeight={20} />
            </Flex>
            <Flex flexDirection={"row"} justifyContent={"space-between"}>
              <Placeholder width={230} containerHeight={20} />
              <Placeholder width={70} containerHeight={20} />
            </Flex>
          </Flex>
        ))}
      </Flex>
    ),
    [],
  );

  // console.log("lehgnt", marketData?.length);

  return (
    <FlatList
      data={topGainers}
      renderItem={renderItems}
      scrollEventThrottle={50}
      initialNumToRender={3}
      keyExtractor={(item, index) => item.id + index}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
}
