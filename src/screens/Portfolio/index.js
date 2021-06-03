// @flow
import React, { useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  SectionList,
  FlatList,
  SafeAreaView,
  View,
} from "react-native";
import Animated, { interpolate } from "react-native-reanimated";
import { createNativeWrapper } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import type { SectionBase } from "react-native/Libraries/Lists/SectionList";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import {
  groupAccountsOperationsByDay,
  isAccountEmpty,
} from "@ledgerhq/live-common/lib/account";

import {
  useRefreshAccountsOrdering,
  useDistribution,
} from "../../actions/general";
import {
  accountsSelector,
  flattenAccountsSelector,
} from "../../reducers/accounts";
import { counterValueCurrencySelector } from "../../reducers/settings";
import { usePortfolio } from "../../actions/portfolio";
import SectionHeader from "../../components/SectionHeader";
import NoMoreOperationFooter from "../../components/NoMoreOperationFooter";
import LoadingFooter from "../../components/LoadingFooter";
import OperationRow from "../../components/OperationRow";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";

import GraphCardContainer from "./GraphCardContainer";
import { DistributionList } from "../Distribution";
import Carousel from "../../components/Carousel";
import Button from "../../components/Button";
import StickyHeader from "./StickyHeader";
import EmptyStatePortfolio from "./EmptyStatePortfolio";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import TrackScreen from "../../analytics/TrackScreen";
import NoOpStatePortfolio from "./NoOpStatePortfolio";
import NoOperationFooter from "../../components/NoOperationFooter";
import MigrateAccountsBanner from "../MigrateAccounts/Banner";
import RequireTerms from "../../components/RequireTerms";
import { useScrollToTop } from "../../navigation/utils";
import { ScreenName } from "../../const";

import FabActions from "../../components/FabActions";
import LText from "../../components/LText";

export { default as PortfolioTabIcon } from "./TabIcon";

const AnimatedFlatListWithRefreshControl = createNativeWrapper(
  Animated.createAnimatedComponent(globalSyncRefreshControl(FlatList)),
  {
    disallowInterruption: true,
    shouldCancelWhenOutside: false,
  },
);
type Props = {
  navigation: any,
};

export default function PortfolioScreen({ navigation }: Props) {
  const accounts = useSelector(accountsSelector);
  const allAccounts = useSelector(flattenAccountsSelector);
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const portfolio = usePortfolio();
  const { t } = useTranslation();

  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  useFocusEffect(refreshAccountsOrdering);

  const [opCount, setOpCount] = useState(50);
  const scrollY = useRef(new Animated.Value(0)).current;
  const ref = useRef();
  useScrollToTop(ref);
  const { colors } = useTheme();

  function keyExtractor(item: Operation) {
    return item.id;
  }

  const ListHeaderComponent = useCallback(
    () => (
      <View>
        <GraphCardContainer
          counterValueCurrency={counterValueCurrency}
          portfolio={portfolio}
          showGreeting={!accounts.every(isAccountEmpty)}
        />
      </View>
    ),
    [accounts, counterValueCurrency, portfolio],
  );

  function ListEmptyComponent() {
    if (accounts.length === 0) {
      return <EmptyStatePortfolio navigation={navigation} />;
    }

    if (accounts.every(isAccountEmpty)) {
      return <NoOpStatePortfolio />;
    }

    return null;
  }

  function StickyActions() {
    const offset = 410;
    const top = interpolate(scrollY, {
      inputRange: [offset, offset + 56],
      outputRange: [0, 56],
      extrapolate: "clamp",
    });

    return accounts.length === 0 ? null : (
      <View style={[styles.stickyActions]}>
        <Animated.View
          style={[
            styles.styckyActionsInner,
            { transform: [{ translateY: top }] },
          ]}
        >
          <FabActions />
        </Animated.View>
      </View>
    );
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

  function onEndReached() {
    setOpCount(opCount + 50);
  }

  const { sections: sectionsAll, completed } = groupAccountsOperationsByDay(
    accounts,
    {
      count: opCount,
      withSubAccounts: true,
    },
  );
  const maxOperationsToDisplay = 10;
  const { sections, nb, total } = sectionsAll.reduce(
    ({ nb, sections, total }, section) => {
      if (nb >= maxOperationsToDisplay) {
        return { nb, sections, total: total + section.data.length };
      }
      const left = maxOperationsToDisplay - nb;
      const taken = section.data.slice(0, left);
      return {
        nb: nb + taken.length,
        total: total + section.data.length,
        sections: [
          ...sections,
          {
            ...section,
            data: taken,
          },
        ],
      };
    },
    { nb: 0, total: 0, sections: [] },
  );
  const canSeeMoreSection = total > nb;
  const onTransactionButtonPress = useCallback(() => {
    navigation.navigate(ScreenName.PortfolioOperationHistory);
  }, [navigation]);

  const showingPlaceholder =
    accounts.length === 0 || accounts.every(isAccountEmpty);

  const showDistribution =
    portfolio.balanceHistory[portfolio.balanceHistory.length - 1].value > 0;
  const [highlight, setHighlight] = useState(-1);
  const flatListRef = useRef();
  let distribution = useDistribution();
  distribution = {
    ...distribution,
    list: distribution.list.slice(0, 3),
  };
  const onDistributionButtonPress = useCallback(() => {
    navigation.navigate(ScreenName.Distribution);
  }, [navigation]);

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          paddingTop: extraStatusBarPadding,
          backgroundColor: colors.background,
        },
      ]}
    >
      {!showingPlaceholder ? (
        <StickyHeader
          scrollY={scrollY}
          portfolio={portfolio}
          counterValueCurrency={counterValueCurrency}
        />
      ) : null}

      <RequireTerms />

      <TrackScreen category="Portfolio" accountsLength={accounts.length} />

      <AnimatedFlatListWithRefreshControl
        ref={ref}
        data={[
          ...(accounts.length > 0 && !accounts.every(isAccountEmpty)
            ? [<Carousel />]
            : []),
          ListHeaderComponent(),
          StickyActions(),
          ...(showDistribution
            ? [
                <View style={styles.distrib}>
                  <LText bold secondary style={styles.distributionTitle}>
                    {t("distribution.header")}
                  </LText>
                  <DistributionList
                    flatListRef={flatListRef}
                    highlight={highlight}
                    distribution={distribution}
                    setHighlight={setHighlight}
                  />
                  <Button
                    event="View Distribution"
                    type="primary"
                    title={t("common.seeAll")}
                    onPress={onDistributionButtonPress}
                  />
                </View>,
              ]
            : []),
          <SectionList
            // $FlowFixMe
            sections={sections}
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            // $FlowFixMe
            renderSectionHeader={renderSectionHeader}
            onEndReached={onEndReached}
            stickySectionHeadersEnabled={false}
            ListFooterComponent={
              !completed ? (
                <LoadingFooter />
              ) : accounts.every(isAccountEmpty) ? null : sections.length &&
                !canSeeMoreSection ? (
                <NoMoreOperationFooter />
              ) : sections.length && canSeeMoreSection ? (
                <Button
                  event="View Transactions"
                  type="primary"
                  title={t("common.seeAll")}
                  onPress={onTransactionButtonPress}
                />
              ) : (
                <NoOperationFooter />
              )
            }
            ListEmptyComponent={ListEmptyComponent}
          />,
        ]}
        style={styles.inner}
        renderItem={({ item }) => item}
        keyExtractor={(item, index) => String(index)}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ],
          { useNativeDriver: true },
        )}
        testID={
          accounts.length ? "PortfolioAccountsList" : "PortfolioEmptyAccount"
        }
      />
      <MigrateAccountsBanner />
    </SafeAreaView>
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
