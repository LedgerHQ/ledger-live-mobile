/* @flow */
import React, { Component, PureComponent, Fragment } from "react";
import { getFiatUnit } from "@ledgerhq/currencies";
import moment from "moment";
import {
  Image,
  View,
  SectionList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import type {
  CalculateCounterValue,
  Account,
  Operation
} from "@ledgerhq/wallet-common/lib/types";
import {
  getBalanceHistorySum,
  groupAccountsOperationsByDay
} from "@ledgerhq/wallet-common/lib/helpers/account";
import ScreenGeneric from "../components/ScreenGeneric";
import colors from "../colors";
import LText from "../components/LText";
import BalanceChart from "../components/BalanceChart";
import BlueButton from "../components/BlueButton";
import CurrencyUnitValue from "../components/CurrencyUnitValue";
import CounterValue from "../components/CounterValue";
import BalanceChartMiniature from "../components/BalanceChartMiniature";
import CurrencyIcon from "../components/CurrencyIcon";
import { withLocale } from "../components/LocaleContext";
import GenerateMockAccountsButton from "../components/GenerateMockAccountsButton";
import PriceChange from "../components/PriceChange";
import { getVisibleAccounts } from "../reducers/accounts";
import { calculateCounterValueSelector } from "../reducers/counterValues";

class ListHeaderComponent extends PureComponent<
  {
    accounts: Account[],
    totalBalance: number,
    calculateCounterValue: CalculateCounterValue
  },
  *
> {
  render() {
    const { accounts, calculateCounterValue } = this.props;
    const fiatUnit = getFiatUnit("USD"); // FIXME no more hardcoded
    const data = getBalanceHistorySum(
      accounts,
      15,
      fiatUnit,
      calculateCounterValue
    );
    const startPrice: number = data ? data[0].value : 0;
    const endPrice: number = data ? data[data.length - 1].value : 0;

    return (
      <View style={styles.carouselCountainer}>
        <View style={{ padding: 10, flexDirection: "row" }}>
          <View>
            <LText semiBold style={styles.balanceText}>
              <CurrencyUnitValue
                unit={fiatUnit}
                value={this.props.totalBalance}
              />
            </LText>
            {data ? (
              <PriceChange
                before={startPrice}
                after={endPrice}
                color="western"
              />
            ) : null}
          </View>
        </View>
        {data ? (
          <BalanceChart
            width={400}
            height={250}
            data={data}
            unit={getFiatUnit("USD")}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accounts: getVisibleAccounts(state),
  calculateCounterValue: calculateCounterValueSelector(state)
});

class OperationRow extends PureComponent<{
  operation: Operation,
  account: Account
}> {
  render() {
    const { operation, account } = this.props;
    const { unit, currency } = account;

    return (
      <View style={styles.operationsRowContainer}>
        <CurrencyIcon size={32} currency={currency} />
        <View style={styles.operationsCurrencyIcon}>
          <LText
            numberOfLines={1}
            semiBold
            style={styles.operationsAccountName}
          >
            {account.name}
          </LText>
          <LText
            numberOfLines={1}
            ellipsizeMode="middle"
            style={styles.operationsAddress}
          >
            {operation.address}
          </LText>
        </View>
        <View
          style={[styles.operationsAmountContainer, { alignItems: "flex-end" }]}
        >
          <LText
            style={{
              fontSize: 14,
              color: operation.amount > 0 ? colors.green : colors.red
            }}
          >
            <CurrencyUnitValue unit={unit} value={operation.amount} />
          </LText>
          <LText style={styles.counterValue}>
            <CounterValue
              value={operation.amount}
              date={operation.date}
              currency={account.currency}
            />
          </LText>
        </View>
      </View>
    );
  }
}

const ListFooterComponent = () => (
  <ActivityIndicator style={{ margin: 40 }} color={colors.blue} />
);

const Onboarding = ({ goToImportAccounts }: *) => (
  <View
    style={{
      flex: 1,
      padding: 40,
      justifyContent: "center"
    }}
  >
    <LText
      semiBold
      style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}
    >
      No accounts yet!
    </LText>
    <View style={{ flexDirection: "row" }}>
      <BlueButton
        title="Import Accounts"
        onPress={goToImportAccounts}
        containerStyle={{ marginRight: 20 }}
      />
      {__DEV__ ? <GenerateMockAccountsButton title="Generate Mock" /> : null}
    </View>
  </View>
);

class Dashboard extends Component<
  {
    accounts: Account[],
    calculateCounterValue: *,
    t: *,
    screenProps: *
  },
  *
> {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }: *) => (
      <Image
        source={require("../images/dashboard.png")}
        style={{ tintColor, width: 32, height: 32 }}
      />
    )
  };

  state = {
    headerSwitched: false,
    refreshing: false,
    opCount: 50
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      this.setState({ opCount: 50 });
    } finally {
      this.setState({ refreshing: false });
    }
  };

  keyExtractor = (item: Operation) => item.id;

  renderItem = ({ item }: { item: Operation }) => {
    const account = this.props.accounts.find(a => a.id === item.accountId);
    if (!account) return null;
    return <OperationRow operation={item} account={account} />;
  };

  renderSectionHeader = ({ section }: { section: * }) => (
    <LText numberOfLines={1} semiBold style={styles.sectionHeader}>
      {moment(section.day).calendar(null, {
        sameDay: "[Today]",
        nextDay: "[Tomorrow]",
        lastDay: "[Yesterday]",
        lastWeek: "[Last] dddd",
        sameElse: "DD/MM/YYYY"
      })}
    </LText>
  );

  renderHeader = ({ totalBalance }: *) => {
    const { t, accounts, calculateCounterValue } = this.props;
    if (accounts.length === 0) return null;
    const { headerSwitched } = this.state;
    const fiatUnit = getFiatUnit("USD");
    const data = getBalanceHistorySum(
      accounts,
      15,
      fiatUnit,
      calculateCounterValue
    );
    const startPrice: number = data ? data[0].value : 0;
    const endPrice: number = data ? data[data.length - 1].value : 0;

    return (
      <View style={styles.header}>
        {headerSwitched ? (
          <Fragment>
            <LText semiBold style={styles.balanceTextHeader}>
              <CurrencyUnitValue unit={fiatUnit} value={totalBalance} />
            </LText>
            <PriceChange
              before={startPrice}
              after={endPrice}
              style={{ color: "white" }}
            />
            <BalanceChartMiniature
              width={100}
              height={60}
              data={data}
              color="white"
            />
          </Fragment>
        ) : (
          <View style={styles.headerLeft}>
            <LText style={styles.headerText}>
              {t("home_title", { name: "John Doe" })}
            </LText>
            <LText style={styles.headerTextSubtitle}>
              {t("home_subtitle", { count: accounts.length })}
            </LText>
          </View>
        )}
      </View>
    );
  };

  sectionList: ?SectionList<*>;
  onSectionListRef = (ref: ?SectionList<*>) => {
    this.sectionList = ref;
  };

  scrollUp = () => {
    const { sectionList } = this;
    if (sectionList) {
      sectionList.scrollToLocation({
        itemIndex: 0,
        sectionIndex: 0,
        viewOffset: 340
      });
    }
  };

  goToImportAccounts = () => {
    this.props.screenProps.topLevelNavigation.navigate({
      routeName: "ImportAccounts",
      key: "importaccounts"
    });
  };

  onEndReached = () => {
    this.setState(({ opCount }) => ({ opCount: opCount + 50 }));
  };

  onScroll = ({ nativeEvent: { contentOffset } }) => {
    const headerSwitched = contentOffset.y > 300;
    this.setState(
      s => (headerSwitched !== s.headerSwitched ? { headerSwitched } : null)
    );
  };

  ListHeaderComponent = () => {
    const { accounts, calculateCounterValue } = this.props;
    const totalBalance = accounts.reduce(
      (sum, account) =>
        sum +
        calculateCounterValue(account.currency, getFiatUnit("USD"))(
          account.balance
        ),
      0
    );
    return (
      <ListHeaderComponent
        totalBalance={totalBalance}
        accounts={accounts}
        calculateCounterValue={calculateCounterValue}
      />
    );
  };

  render() {
    const { accounts, calculateCounterValue } = this.props;
    const { opCount, refreshing } = this.state;
    const fiatUnit = getFiatUnit("USD");
    const data = groupAccountsOperationsByDay(accounts, opCount);
    const totalBalance = accounts.reduce(
      // FIXME pick from last graph point? (no need to compute it again)
      (sum, account) =>
        sum +
        calculateCounterValue(account.currency, fiatUnit)(account.balance),
      0
    );
    return accounts.length === 0 ? (
      <Onboarding goToImportAccounts={this.goToImportAccounts} />
    ) : (
      <ScreenGeneric
        onPressHeader={this.scrollUp}
        renderHeader={this.renderHeader}
        extraData={{ totalBalance }}
      >
        <View style={styles.topBackground} />
        <SectionList
          sections={(data: any) /* FIXME flow */ || []}
          ref={this.onSectionListRef}
          style={styles.sectionList}
          contentContainerStyle={styles.sectionListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          ListHeaderComponent={this.ListHeaderComponent}
          ListFooterComponent={data ? null : ListFooterComponent}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          onEndReached={this.onEndReached}
          onScroll={this.onScroll}
        />
      </ScreenGeneric>
    );
  }
}

export default withLocale(connect(mapStateToProps)(Dashboard));

const styles = StyleSheet.create({
  carouselCountainer: {
    padding: 0,
    height: 300,
    backgroundColor: "white"
  },
  topBackground: {
    position: "absolute",
    top: 0,
    width: 600,
    height: 300,
    backgroundColor: "white"
  },
  sectionList: {
    flex: 1
  },
  sectionListContent: {
    backgroundColor: colors.lightBackground
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    paddingLeft: 10
  },
  headerLeft: {
    justifyContent: "space-around"
  },
  headerTextSubtitle: {
    color: "white",
    opacity: 0.8,
    fontSize: 12
  },
  headerText: {
    color: "white",
    fontSize: 16
  },
  balanceText: {
    fontSize: 24
  },
  balanceTextHeader: {
    color: "white",
    fontSize: 24
  },
  sectionHeader: {
    fontSize: 12,
    color: "#999",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.lightBackground
  },
  operationsRowContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "row"
  },
  operationsCurrencyIcon: {
    flexDirection: "column",
    flex: 1,
    marginHorizontal: 10
  },
  operationsAddress: {
    fontSize: 12,
    opacity: 0.5
  },
  operationsAmountContainer: {
    flexDirection: "column",
    flex: 1,
    marginHorizontal: 10
  },
  operationsAccountName: { marginLeft: 6, fontSize: 12 },
  counterValue: {
    fontSize: 12,
    opacity: 0.5
  }
});
