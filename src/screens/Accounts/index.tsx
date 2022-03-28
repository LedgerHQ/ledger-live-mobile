import React, { useCallback, useRef, useState, useEffect, memo } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Account } from "@ledgerhq/live-common/lib/types";
import { findCryptoCurrencyByKeyword } from "@ledgerhq/live-common/lib/currencies";
import { Box, Flex, Icons, Text } from "@ledgerhq/native-ui";

import { flattenAccounts } from "@ledgerhq/live-common/lib/account";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRefreshAccountsOrdering } from "../../actions/general";
import { accountsSelector } from "../../reducers/accounts";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";
import TrackScreen from "../../analytics/TrackScreen";

import NoAccounts from "./NoAccounts";
import AccountRow from "./AccountRow";
import MigrateAccountsBanner from "../MigrateAccounts/Banner";
import TokenContextualModal from "../Settings/Accounts/TokenContextualModal";
import { ScreenName } from "../../const";
import { withDiscreetMode } from "../../context/DiscreetModeContext";
import { usePortfolio } from "../../actions/portfolio";
import AddAccount from "./AddAccount";
import AccountOrder from "./AccountOrder";

import FilteredSearchBar from "../../components/FilteredSearchBar";

const SEARCH_KEYS = ["name", "unit.code", "token.name", "token.ticker"];

const List = globalSyncRefreshControl(FlatList);

type Props = {
  navigation: any;
  route: { params?: { currency?: string; search?: string } };
};

function Accounts({ navigation, route }: Props) {
  const accounts = useSelector(accountsSelector);
  const portfolio = usePortfolio();
  const { t } = useTranslation();

  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  useFocusEffect(refreshAccountsOrdering);

  const { params } = route;

  const search = params?.search;

  const [account, setAccount] = useState(undefined);

  const flattenedAccounts = flattenAccounts(accounts);

  // Deep linking params redirect
  useEffect(() => {
    if (params) {
      if (params.currency) {
        const currency = findCryptoCurrencyByKeyword(
          params.currency.toUpperCase(),
        );
        if (currency) {
          const account = accounts.find(acc => acc.currency.id === currency.id);

          if (account) {
            // reset params so when we come back the redirection doesn't loop
            navigation.setParams({ ...params, currency: undefined });
            navigation.navigate(ScreenName.Account, {
              accountId: account.id,
              isForwardedFromAccounts: true,
            });
          }
        }
      }
    }
  }, [params, accounts, navigation]);

  const renderItem = useCallback(
    ({ item, index }: { item: Account; index: number }) => (
      <AccountRow
        navigation={navigation}
        account={item}
        accountId={item.id}
        onSetAccount={setAccount}
        isLast={index === accounts.length - 1}
        portfolioValue={
          portfolio.balanceHistory[portfolio.balanceHistory.length - 1].value
        }
      />
    ),
    [navigation, accounts.length, portfolio.balanceHistory],
  );

  const renderList = useCallback(
    items => (
      <List
        data={items}
        renderItem={renderItem}
        keyExtractor={i => i.id}
        ListEmptyComponent={<NoAccounts />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    ),
    [renderItem],
  );

  const renderEmptySearch = useCallback(
    () => (
      <Flex>
        <Text variant="h3" color="fog">
          {t("transfer.receive.noAccount")}
        </Text>
      </Flex>
    ),
    [t],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TrackScreen category="Accounts" accountsLength={accounts.length} />
      <Flex flex={1} bg={"background.main"}>
        <Flex p={6} flexDirection="row" alignItems="center">
          <Box mr={3}>
            <TouchableOpacity onPress={navigation.goBack}>
              <Icons.ArrowLeftMedium size={24} />
            </TouchableOpacity>
          </Box>
          <Flex
            height={30}
            flexDirection="column"
            justifyContent="center"
            mt={4}
            mb={3}
            flex={1}
          >
            <Text variant="h1">{t("distribution.title")}</Text>
          </Flex>
          <Flex flexDirection="row" alignItems={"center"}>
            <Box mr={7}>
              {!flattenedAccounts.length ? null : <AccountOrder />}
            </Box>
            <AddAccount />
          </Flex>
        </Flex>
        <FilteredSearchBar
          list={flattenedAccounts}
          inputWrapperStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
          renderList={renderList}
          renderEmptySearch={renderEmptySearch}
          keys={SEARCH_KEYS}
          initialQuery={search}
        />

        <MigrateAccountsBanner />
        <TokenContextualModal
          onClose={() => setAccount(undefined)}
          isOpened={!!account}
          account={account}
        />
      </Flex>
    </SafeAreaView>
  );
}

export default memo(withDiscreetMode(Accounts));
