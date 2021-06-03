// @flow
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { groupAccountsOperationsByDay } from "@ledgerhq/live-common/lib/account/groupOperations";
import { isAccountEmpty } from "@ledgerhq/live-common/lib/account/helpers";

import { useRefreshAccountsOrdering } from "../../actions/general";
import {
  accountsSelector,
  flattenAccountsSelector,
} from "../../reducers/accounts";

import NoOperationFooter from "../../components/NoOperationFooter";
import NoMoreOperationFooter from "../../components/NoMoreOperationFooter";

import EmptyStatePortfolio from "./EmptyStatePortfolio";
import NoOpStatePortfolio from "./NoOpStatePortfolio";
import OperationRow from "../../components/OperationRow";
import SectionHeader from "../../components/SectionHeader";
import LoadingFooter from "../../components/LoadingFooter";

type Props = {
  navigation: any,
};
function PortfolioHistory({ navigation }: Props) {
  const accounts = useSelector(accountsSelector);
  const allAccounts = useSelector(flattenAccountsSelector);
  const { t } = useTranslation();

  const [opCount, setOpCount] = useState(50);

  function onEndReached() {
    setOpCount(opCount + 50);
  }

  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  useFocusEffect(refreshAccountsOrdering);

  const { sections, completed } = groupAccountsOperationsByDay(accounts, {
    count: opCount,
    withSubAccounts: true,
  });

  function ListEmptyComponent() {
    if (accounts.length === 0) {
      return <EmptyStatePortfolio navigation={navigation} />;
    }

    if (accounts.every(isAccountEmpty)) {
      return <NoOpStatePortfolio />;
    }

    return null;
  }

  function keyExtractor(item: Operation) {
    return item.id;
  }

  function renderItem({
    item,
    index,
    section,
  }: {
    item: Operation,
    index: number,
    section: SectionBase<*>,
  }) {
    const account = allAccounts.find(a => a.id === item.accountId);
    const parentAccount =
      account && account.type !== "Account"
        ? accounts.find(a => a.id === account.parentId)
        : null;

    if (!account) return null;

    return (
      <OperationRow
        operation={item}
        parentAccount={parentAccount}
        account={account}
        multipleAccounts
        isLast={section.data.length - 1 === index}
      />
    );
  }

  function renderSectionHeader({ section }: { section: { day: Date } }) {
    return <SectionHeader section={section} />;
  }

  return (
    <SectionList
      // $FlowFixMe
      sections={sections}
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      // $FlowFixMe
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false}
      onEndReached={onEndReached}
      ListFooterComponent={
        !completed ? (
          <LoadingFooter />
        ) : accounts.every(isAccountEmpty) ? null : sections.length ? (
          <NoMoreOperationFooter />
        ) : (
          <NoOperationFooter />
        )
      }
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  inner: {
    position: "relative",
    flex: 1,
  },
  distrib: {
    marginTop: -56,
  },
  distributionTitle: {
    fontSize: 16,
    lineHeight: 24,

    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 64,
  },
  stickyActions: {
    height: 110,
    width: "100%",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  styckyActionsInner: { height: 56 },
});

export default memo<Props>(PortfolioHistory);
