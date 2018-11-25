// @flow

import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { View, StyleSheet, Animated } from "react-native";
// $FlowFixMe flowtyped not up to date
import { SectionList, SafeAreaView } from "react-navigation";
import { translate } from "react-i18next";
import Config from "react-native-config";

import type { Account, Operation } from "@ledgerhq/live-common/lib/types";
import { groupAccountsOperationsByDay } from "@ledgerhq/live-common/lib/account";
import type AnimatedValue from "react-native/Libraries/Animated/src/nodes/AnimatedValue";

import colors from "../../colors";

import { accountsSelector } from "../../reducers/accounts";
import {
  hasCompletedOnboardingSelector,
  hasAcceptedTradingWarningSelector,
} from "../../reducers/settings";
import { acceptTradingWarning } from "../../actions/settings";
import SectionHeader from "../../components/SectionHeader";
import NoMoreOperationFooter from "../../components/NoMoreOperationFooter";
import NoOperationFooter from "../../components/NoOperationFooter";
import LoadingFooter from "../../components/LoadingFooter";
import OperationRow from "../../components/OperationRow";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";
import provideSummary from "../../components/provideSummary";

import type { Summary } from "../../components/provideSummary";

import GraphCardContainer from "./GraphCardContainer";
import StickyHeader from "./StickyHeader";
import EmptyStatePortfolio from "./EmptyStatePortfolio";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import SyncBackground from "../../bridge/SyncBackground";
import TradingDisclaimer from "../../modals/TradingDisclaimer";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const List = globalSyncRefreshControl(AnimatedSectionList);

const mapStateToProps = state => ({
  accounts: accountsSelector(state),
  hasCompletedOnboarding: hasCompletedOnboardingSelector(state),
  hasAcceptedTradingWarning: hasAcceptedTradingWarningSelector(state),
});

const mapDispatchToProps = {
  acceptTradingWarning,
};

class Portfolio extends Component<
  {
    acceptTradingWarning: () => void,
    accounts: Account[],
    summary: Summary,
    navigation: *,
    hasCompletedOnboarding: boolean,
    hasAcceptedTradingWarning: boolean,
  },
  {
    opCount: number,
    scrollY: AnimatedValue,
    isModalOpened: boolean,
  },
> {
  state = {
    opCount: 50,
    isModalOpened: !this.props.hasAcceptedTradingWarning,
    scrollY: new Animated.Value(0),
  };

  componentDidMount() {
    if (!this.props.hasCompletedOnboarding && !Config.SKIP_ONBOARDING) {
      // TODO: there is probably more elegant way to do that
      // NOTE: probably since we use a switch navigation, we can pass initialRouteName: https://reactnavigation.org/docs/en/switch-navigator.html#switchnavigatorconfig
      this.props.navigation.navigate("Onboarding");
    }
  }

  keyExtractor = (item: Operation) => item.id;

  ListHeaderComponent = () => (
    <GraphCardContainer summary={this.props.summary} />
  );

  renderItem = ({ item }: { item: Operation }) => {
    const account = this.props.accounts.find(a => a.id === item.accountId);

    if (!account) return null;

    return (
      <OperationRow
        operation={item}
        account={account}
        navigation={this.props.navigation}
        multipleAccounts
      />
    );
  };

  renderSectionHeader = ({ section }: { section: * }) => (
    <SectionHeader section={section} />
  );

  onEndReached = () => {
    this.setState(({ opCount }) => ({ opCount: opCount + 50 }));
  };

  onModalClose = () => {
    this.props.acceptTradingWarning();
    this.setState({ isModalOpened: false });
  };

  render() {
    const {
      summary,
      accounts,
      navigation,
      hasAcceptedTradingWarning,
    } = this.props;
    const { opCount, scrollY, isModalOpened } = this.state;
    const disclaimer = !hasAcceptedTradingWarning && (
      <TradingDisclaimer isOpened={isModalOpened} onClose={this.onModalClose} />
    );

    if (accounts.length === 0) {
      return (
        <View style={styles.root}>
          <EmptyStatePortfolio navigation={navigation} />
          {disclaimer}
        </View>
      );
    }

    const { sections, completed } = groupAccountsOperationsByDay(
      accounts,
      opCount,
    );

    return (
      <View style={[styles.root, { paddingTop: extraStatusBarPadding }]}>
        <StickyHeader
          navigation={navigation}
          scrollY={scrollY}
          summary={summary}
        />
        <SyncBackground />

        <SafeAreaView style={styles.inner}>
          <List
            sections={sections}
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            renderSectionHeader={this.renderSectionHeader}
            onEndReached={this.onEndReached}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true },
            )}
            ListHeaderComponent={this.ListHeaderComponent}
            ListFooterComponent={
              !completed
                ? LoadingFooter
                : sections.length === 0
                  ? NoOperationFooter
                  : NoMoreOperationFooter
            }
          />
        </SafeAreaView>
        {disclaimer}
      </View>
    );
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  provideSummary,
  translate(),
)(Portfolio);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  inner: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 64,
  },
});
