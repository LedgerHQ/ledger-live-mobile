// @flow

import React, { Component } from "react";
import { StyleSheet } from "react-native";
// $FlowFixMe flowtyped not up to date
import { FlatList } from "react-navigation";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { translate } from "react-i18next";
import { compose } from "redux";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { accountsSelector } from "../../reducers/accounts";
import AccountsIcon from "../../icons/Accounts";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";

import NoAccounts from "./NoAccounts";
import AccountRow from "./AccountRow";
import AccountOrder from "./AccountOrder";
import AddAccount from "./AddAccount";

const List = globalSyncRefreshControl(FlatList);

const navigationOptions = {
  title: "Accounts",
  headerLeft: <AccountOrder />,
  headerRight: <AddAccount />,
  tabBarIcon: ({ tintColor }: { tintColor: string }) => (
    <AccountsIcon size={18} color={tintColor} />
  ),
};

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
});

type Props = {
  navigation: *,
  accounts: Account[],
};

class Accounts extends Component<Props> {
  static navigationOptions = navigationOptions;

  onAddMockAccount = () => {};

  renderItem = ({ item, index }: { item: Account, index: number }) => (
    <AccountRow
      navigation={this.props.navigation}
      account={item}
      accountId={item.id}
      isLast={index === this.props.accounts.length - 1}
    />
  );

  keyExtractor = item => item.id;

  render() {
    const { accounts, navigation } = this.props;

    if (accounts.length === 0) {
      return <NoAccounts navigation={navigation} />;
    }

    return (
      <List
        data={accounts}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
      />
    );
  }
}

export default compose(
  connect(mapStateToProps),
  translate(),
)(Accounts);

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 64,
  },
});
