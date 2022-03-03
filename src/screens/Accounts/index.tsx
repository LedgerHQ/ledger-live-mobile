import React, { useCallback, useRef, useState, useEffect } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Account } from "@ledgerhq/live-common/lib/types";
import { findCryptoCurrencyByKeyword } from "@ledgerhq/live-common/lib/currencies";
import {
  Box,
  Flex,
  Icons,
  ScrollContainerHeader,
  Text,
} from "@ledgerhq/native-ui";

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
import { useScrollToTop } from "../../navigation/utils";
import TokenContextualModal from "../Settings/Accounts/TokenContextualModal";
import { ScreenName } from "../../const";
import { withDiscreetMode } from "../../context/DiscreetModeContext";
import { usePortfolio } from "../../actions/portfolio";
import AddAccount from "./AddAccount";
import AccountOrder from "./AccountOrder";

const List = globalSyncRefreshControl(FlatList);

type Props = {
  navigation: any;
  route: { params?: { currency?: string } };
};

function Accounts({ navigation, route }: Props) {
  const accounts = useSelector(accountsSelector);
  const ref = useRef();
  useScrollToTop(ref);
  const portfolio = usePortfolio();

  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  useFocusEffect(refreshAccountsOrdering);

  const { params } = route;

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
    [navigation, accounts.length],
  );

  if (accounts.length === 0) {
    return (
      <>
        <TrackScreen category="Accounts" accountsLength={0} />
        <NoAccounts navigation={navigation} />
      </>
    );
  }
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Flex flex={1} position="relative">
        <TrackScreen category="Accounts" accountsLength={accounts.length} />

        <ScrollContainerHeader
          bg="background.main"
          width="100%"
          flex={1}
          TopLeftSection={
            <Box mr={3}>
              <TouchableOpacity onPress={navigation.goBack}>
                <Icons.ArrowLeftMedium size={24} />
              </TouchableOpacity>
            </Box>
          }
          TopRightSection={
            <Flex flexDirection="row" alignItems={"center"}>
              <Box mr={7}>
                <AccountOrder />
              </Box>
              <AddAccount />
            </Flex>
          }
          MiddleSection={
            <Flex
              height={30}
              flexDirection="column"
              justifyContent="center"
              mt={4}
              mb={3}
            >
              <Text variant="h1">{t("v3.distribution.title")}</Text>
            </Flex>
          }
        >
          <Flex flex={1} bg={"background.main"} px={6}>
            <List
              ref={ref}
              data={flattenedAccounts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
            <MigrateAccountsBanner />
            <TokenContextualModal
              onClose={() => setAccount(undefined)}
              isOpened={!!account}
              account={account}
            />
          </Flex>
        </ScrollContainerHeader>
      </Flex>
    </SafeAreaView>
  );
}

export default withDiscreetMode(Accounts);
