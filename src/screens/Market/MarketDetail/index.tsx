/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/named */
/* eslint-disable import/no-unresolved */
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useTheme } from "styled-components/native";
import { Flex, Text, ScrollContainerHeader, Icons } from "@ledgerhq/native-ui";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  useMarketData,
  useSingleCoinMarketData,
} from "@ledgerhq/live-common/lib/market/MarketDataProvider";
import { rangeDataTable } from "@ledgerhq/live-common/lib/market/utils/rangeDataTable";
import { Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Account } from "@ledgerhq/live-common/lib/types";
import {
  starredMarketCoinsSelector,
  swapSelectableCurrenciesSelector,
} from "../../../reducers/settings";
import { useLocale } from "../../../context/Locale";
import { NavigatorName, ScreenName } from "../../../const";
import { isCurrencySupported } from "../../Exchange/coinifyConfig";
import CircleCurrencyIcon from "../../../components/CircleCurrencyIcon";
import { IconContainer } from "../MarketRowItem";
import { counterValueFormatter, getDateFormatter } from "../utils";
import DeltaVariation from "../DeltaVariation";
import {
  addStarredMarketCoins,
  removeStarredMarketCoins,
} from "../../../actions/settings";
import MarketStats from "./MarketStats";
import MarketGraph from "../../../components/chart/ChartCard";
import { accountsByCryptoCurrencyScreenSelector } from "../../../reducers/accounts";
// import AccountRow from "../../Accounts/AccountRow";
import { track } from "../../../analytics";
import Button from "../../../components/wrappedUi/Button";

export const BackButton = ({ navigation }: { navigation: any }) => (
  <Button
    size="large"
    onPress={() => navigation.goBack()}
    Icon={Icons.ArrowLeftMedium}
  />
);

/**
 * The following is disabled for now as the mapping for supported coins is not 100% working (ERC20 etc.)
const NoCoinSupport = ({ t }: { t: TFunction }) => (
  <Flex
    bg="primary.c20"
    px={18}
    py={16}
    borderRadius={4}
    flexDirection="row"
    justifyContent="flex-start"
    alignItems="center"
    mx={16}
    my={16}
  >
    <Icon name="ShieldSecurity" size={16} color="primary.c90" />
    <Text ml={16} color="primary.c90" variant="body">
      {t("market.detailsPage.assetNotSupportedOnLedgerLive")}
    </Text>
  </Flex>
);
*/

export default function MarketDetail({
  navigation,
  route,
}: {
  navigation: any;
  route: { params: { currencyId: string; resetSearchOnUmount?: boolean } };
}) {
  const { params } = route;
  const { currencyId, resetSearchOnUmount } = params;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { locale } = useLocale();
  const dispatch = useDispatch();
  const starredMarketCoins: string[] = useSelector(starredMarketCoinsSelector);
  const isStarred = starredMarketCoins.includes(currencyId);

  const { refresh, selectCurrency } = useMarketData();

  const {
    selectedCoinData: currency,
    chartRequestParams,
    loading,
    loadingChart,
    refreshChart,
    counterCurrency,
  } = useSingleCoinMarketData(currencyId);

  const {
    name,
    image,
    price,
    priceChangePercentage,
    internalCurrency,
    chartData,
    isLiveSupported,
  } = currency || {};

  useEffect(() => {
    const resetState = () => {
      selectCurrency(undefined);
      refresh(resetSearchOnUmount ? { search: "", ids: [] } : {});
    };
    const sub = navigation.addListener("blur", resetState);
    return () => {
      sub();
      resetState();
    };
  }, [selectCurrency, refresh, resetSearchOnUmount, navigation]);

  const allAccounts = useSelector(
    accountsByCryptoCurrencyScreenSelector(internalCurrency),
  );

  const availableOnBuy =
    internalCurrency && isCurrencySupported(internalCurrency, "buy");
  const swapCurrencies = useSelector(state =>
    swapSelectableCurrenciesSelector(state),
  );
  const availableOnSwap =
    internalCurrency &&
    allAccounts?.length > 0 &&
    swapCurrencies.includes(internalCurrency.id);

  const toggleStar = useCallback(() => {
    const action = isStarred ? removeStarredMarketCoins : addStarredMarketCoins;
    dispatch(action(currencyId));
  }, [dispatch, isStarred, currencyId]);

  const { range } = chartRequestParams;
  const { interval } = rangeDataTable[range];

  const dateRangeFormatter = useMemo(() => getDateFormatter(locale, interval), [
    locale,
    interval,
  ]);

  const [hoveredItem, setHoverItem] = useState<
    { date: Date; value: number } | undefined
  >();

  const navigateToBuy = useCallback(() => {
    navigation.navigate(NavigatorName.Exchange, {
      screen: ScreenName.ExchangeBuy,
      params: {
        mode: "buy",
      },
    });
  }, [navigation]);

  /** Disabled for now on demand of PO
  const renderAccountItem = useCallback(
    ({ item, index }: { item: Account; index: number }) => (
      // @ts-expect-error import js issue
      <AccountRow
        navigation={navigation}
        account={item}
        accountId={item.id}
        isLast={index === allAccounts.length - 1}
      />
    ),
    [navigation, allAccounts.length],
  );
  */

  const navigateToSwap = useCallback(() => {
    navigation.navigate(NavigatorName.Swap, {
      screen: ScreenName.Swap,
      params: {
        defaultAccount: allAccounts?.length > 0 ? allAccounts[0] : undefined,
      },
    });
  }, [navigation, allAccounts]);

  useEffect(() => {
    if (name) {
      track("Page Market Coin", {
        currencyName: name,
        starred: isStarred,
        timeframe: chartRequestParams.range,
      });
    }
  }, [name, isStarred, chartRequestParams.range]);

  const [refreshControlVisible, setRefreshControlVisible] = useState(false);

  const handlePullToRefresh = useCallback(() => {
    refreshChart();
    setRefreshControlVisible(true);
  }, [refreshChart, setRefreshControlVisible]);

  useEffect(() => {
    if (refreshControlVisible && !loading) setRefreshControlVisible(false);
  }, [refreshControlVisible, loading]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.main }}>
      <ScrollContainerHeader
        bg="background.main"
        TopLeftSection={<BackButton navigation={navigation} />}
        MiddleSection={
          <Flex
            height={48}
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            {isLiveSupported && internalCurrency ? (
              // @ts-expect-error import js issue
              <CircleCurrencyIcon
                size={32}
                currency={internalCurrency}
                color={undefined}
                sizeRatio={0.9}
              />
            ) : (
              image && (
                <IconContainer>
                  <Image
                    source={{ uri: image }}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </IconContainer>
              )
            )}
            <Text ml={3} variant="large" fontSize={22}>
              {name}
            </Text>
          </Flex>
        }
        TopRightSection={
          <Button
            size="large"
            onPress={toggleStar}
            iconName={isStarred ? "StarSolid" : "Star"}
          />
        }
        BottomSection={
          <Flex justifyContent="center" alignItems="flex-start" pb={3}>
            <Text variant="h1" mb={1}>
              {counterValueFormatter({
                currency: counterCurrency,
                value:
                  hoveredItem && hoveredItem.value ? hoveredItem.value : price,
                locale,
                t,
              })}
            </Text>
            <Flex height={20}>
              {hoveredItem && hoveredItem.date ? (
                <Text variant="body" color="neutral.c70">
                  {dateRangeFormatter.format(hoveredItem.date)}
                </Text>
              ) : priceChangePercentage !== null &&
                !isNaN(priceChangePercentage) ? (
                <DeltaVariation percent value={priceChangePercentage} />
              ) : (
                <Text variant="body" color="neutral.c70">
                  {" "}
                  -
                </Text>
              )}
            </Flex>
          </Flex>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshControlVisible}
            colors={[colors.primary.c80]}
            tintColor={colors.primary.c80}
            onRefresh={handlePullToRefresh}
          />
        }
      >
        <MarketGraph
          setHoverItem={setHoverItem}
          chartRequestParams={chartRequestParams}
          loading={loading}
          loadingChart={loadingChart}
          refreshChart={refreshChart}
          chartData={chartData}
        />
        {isLiveSupported ? (
          <Flex
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            p={16}
          >
            {availableOnBuy ? (
              <Button
                flex={1}
                type="color"
                onPress={navigateToBuy}
                iconName="BuyCryptoAlt"
                event={"Buy Crypto Page Market Coin"}
                eventProperties={{ currencyName: name }}
              >
                {t("account.buy")}
              </Button>
            ) : null}
            {availableOnSwap ? (
              <Button
                ml={16}
                flex={1}
                type="color"
                onPress={navigateToSwap}
                iconName="BuyCrypto"
                event={"Swap Crypto Page Market Coin"}
                eventProperties={{ currencyName: name }}
              >
                {t("transfer.swap.main.header")}
              </Button>
            ) : null}
          </Flex>
        ) : null}
        {/* {allAccounts && allAccounts.length > 0 && isLiveSupported ? (
          <Flex my={16}>
            <Text mx={16} variant="h3">
              {t("market.detailsPage.holding")}
            </Text>
            <FlatList
              data={allAccounts}
              renderItem={renderAccountItem}
              keyExtractor={(item, index) => item.id + index}
            />
          </Flex>
        ) : null} */}
        <MarketStats currency={currency} counterCurrency={counterCurrency} />
      </ScrollContainerHeader>
    </SafeAreaView>
  );
}
