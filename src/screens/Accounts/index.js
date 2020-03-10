// @flow

import React, { useRef } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { accountsSelector } from "../../reducers/accounts";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";
import TrackScreen from "../../analytics/TrackScreen";

import NoAccounts from "./NoAccounts";
import AccountRow from "./AccountRow";
import MigrateAccountsBanner from "../MigrateAccounts/Banner";
import { useScrollToTop } from "../../navigation/utils";

const List = globalSyncRefreshControl(FlatList);

export default function Accounts() {
  const navigation = useNavigation();
  const accounts = useSelector(accountsSelector);
  const ref = useRef();
  useScrollToTop(ref);

  function renderItem({ item, index }: { item: Account, index: number }) {
    return (
      <AccountRow
        navigation={navigation}
        account={item}
        accountId={item.id}
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
        forwardedRef={ref}
        data={accounts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
      />
      <MigrateAccountsBanner />
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
