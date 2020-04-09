// @flow

import React, { useRef, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import type { Account, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { accountsSelector } from "../../reducers/accounts";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";
import TrackScreen from "../../analytics/TrackScreen";

import NoAccounts from "./NoAccounts";
import AccountRow from "./AccountRow";
import MigrateAccountsBanner from "../MigrateAccounts/Banner";
import { useScrollToTop } from "../../navigation/utils";
import BlacklistTokenModal from "../Settings/Accounts/BlacklistTokenModal";

const List = globalSyncRefreshControl(FlatList);

export default function Accounts() {
  const navigation = useNavigation();
  const accounts = useSelector(accountsSelector);
  const ref = useRef();
  useScrollToTop(ref);

  const [blacklistToken, setBlacklistToken] = useState<?TokenCurrency>(
    undefined,
  );

  function renderItem({ item, index }: { item: Account, index: number }) {
    return (
      <AccountRow
        navigation={navigation}
        account={item}
        accountId={item.id}
        onBlacklistToken={setBlacklistToken}
        isLast={index === accounts.length - 1}
      />
    );
  }

  if (accounts.length === 0) {
    return (
      <>
        <TrackScreen category="Accounts" accountsLength={0} />
        <NoAccounts navigation={navigation} />
      </>
    );
  }

  return (
    <>
      <TrackScreen category="Accounts" accountsLength={accounts.length} />
      <List
        ref={ref}
        data={accounts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
      />
      <MigrateAccountsBanner />
      <BlacklistTokenModal
        onClose={() => setBlacklistToken(undefined)}
        isOpened={!!blacklistToken}
        token={blacklistToken}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 64,
  },
});
