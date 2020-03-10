// @flow

import React, { useState, useRef } from "react";
import { StyleSheet, View, Animated, SectionList } from "react-native";
import type { SectionBase } from "react-native/Libraries/Lists/SectionList";
import { useDispatch, useSelector } from "react-redux";
import {
  isAccountEmpty,
  groupAccountOperationsByDay,
  getAccountCurrency,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import type {
  TokenAccount,
  Operation,
  Unit,
} from "@ledgerhq/live-common/lib/types";
import debounce from "lodash/debounce";
import { switchCountervalueFirst } from "../../actions/settings";
import { balanceHistoryWithCountervalueSelectorCreator } from "../../actions/portfolio";
import {
  selectedTimeRangeSelector,
  counterValueCurrencySelector,
  countervalueFirstSelector,
} from "../../reducers/settings";
import { accountScreenSelector } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import accountSyncRefreshControl from "../../components/accountSyncRefreshControl";
import OperationRow from "../../components/OperationRow";
import SectionHeader from "../../components/SectionHeader";
import NoMoreOperationFooter from "../../components/NoMoreOperationFooter";
import LText from "../../components/LText";
import LoadingFooter from "../../components/LoadingFooter";
import { ScreenName } from "../../const";
import colors from "../../colors";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import Header from "./Header";
import EmptyStateAccount from "./EmptyStateAccount";
import AccountActions from "./AccountActions";
import AccountGraphCard from "../../components/AccountGraphCard";
import NoOperationFooter from "../../components/NoOperationFooter";
import Touchable from "../../components/Touchable";
import type { Item } from "../../components/Graph/types";
import SubAccountsList from "./SubAccountsList";
import perFamilyAccountHeader from "../../generated/AccountHeader";
import perFamilyAccountBodyHeader from "../../generated/AccountBodyHeader";
import { useScrollToTop } from "../../navigation/utils";

interface RouteParams {
  accountId: string;
  parentId?: string;
}

interface Props {
  navigation: any;
  route: { params: RouteParams };
}

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const List = accountSyncRefreshControl(AnimatedSectionList);

export default function AccountScreen({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const range = useSelector(selectedTimeRangeSelector);
  const {
    countervalueAvailable,
    countervalueChange,
    cryptoChange,
    history,
  } = useSelector(
    balanceHistoryWithCountervalueSelectorCreator({ account, range }),
  );
  const useCounterValue = useSelector(countervalueFirstSelector);
  const counterValueCurrency = useSelector(counterValueCurrencySelector);

  const [opCount, setOpCount] = useState(100);
  const ref = useRef();

  useScrollToTop(ref);

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
    section: SectionBase<any>,
  }) {
    if (!account) return null;

    return (
      <OperationRow
        operation={item}
        account={account}
        parentAccount={parentAccount}
        isLast={section.data.length - 1 === index}
      />
    );
  }

  function onEndReached(): void {
    setOpCount(opCount + 50);
  }

  function onSwitchAccountCurrency(): void {
    dispatch(switchCountervalueFirst());
  }

  function renderListHeaderTitle({
    useCounterValue,
    cryptoCurrencyUnit,
    counterValueUnit,
    item,
  }: {
    useCounterValue: boolean,
    cryptoCurrencyUnit: Unit,
    counterValueUnit: Unit,
    item: Item,
  }) {
    const items = [
      { unit: cryptoCurrencyUnit, value: item.value },
      countervalueAvailable && item.countervalue
        ? { unit: counterValueUnit, value: item.countervalue }
        : null,
    ];

    const shouldUseCounterValue = countervalueAvailable && useCounterValue;
    if (shouldUseCounterValue && item.countervalue) {
      items.reverse();
    }

    return (
      <Touchable
        event="SwitchAccountCurrency"
        eventProperties={{ useCounterValue: shouldUseCounterValue }}
        onPress={countervalueAvailable ? onSwitchAccountCurrency : undefined}
      >
        <View style={styles.balanceContainer}>
          {items[0] ? (
            <LText style={styles.balanceText} tertiary>
              <CurrencyUnitValue {...items[0]} />
            </LText>
          ) : null}
          {items[1] ? (
            <LText style={styles.balanceSubText} tertiary>
              <CurrencyUnitValue {...items[1]} />
            </LText>
          ) : null}
        </View>
      </Touchable>
    );
  }

  const onAccountPress = debounce((tokenAccount: TokenAccount) => {
    navigation.push(ScreenName.Account, {
      parentId: account.id,
      accountId: tokenAccount.id,
    });
  }, 300);

  function ListHeaderComponent() {
    if (!account) return null;
    const mainAccount = getMainAccount(account, parentAccount);

    const empty = isAccountEmpty(account);
    const shouldUseCounterValue = countervalueAvailable && useCounterValue;

    const AccountHeader = perFamilyAccountHeader[mainAccount.currency.family];
    const AccountBodyHeader =
      perFamilyAccountBodyHeader[mainAccount.currency.family];

    return (
      <View style={styles.header}>
        <Header accountId={account.id} />

        {!empty && AccountHeader ? (
          <AccountHeader account={account} parentAccount={parentAccount} />
        ) : null}

        {empty ? null : (
          <AccountGraphCard
            account={account}
            range={range}
            history={history}
            useCounterValue={shouldUseCounterValue}
            valueChange={
              shouldUseCounterValue ? countervalueChange : cryptoChange
            }
            countervalueAvailable={countervalueAvailable}
            counterValueCurrency={counterValueCurrency}
            renderTitle={renderListHeaderTitle}
          />
        )}
        {empty ? null : (
          <AccountActions account={account} parentAccount={parentAccount} />
        )}

        {!empty && AccountBodyHeader ? (
          <AccountBodyHeader account={account} parentAccount={parentAccount} />
        ) : null}
        {!empty && account.type === "Account" && account.subAccounts ? (
          <SubAccountsList
            accountId={account.id}
            onAccountPress={onAccountPress}
            parentAccount={account}
          />
        ) : null}
      </View>
    );
  }

  function ListEmptyComponent() {
    return (
      isAccountEmpty(account) && (
        <EmptyStateAccount
          account={account}
          parentAccount={parentAccount}
          navigation={navigation}
        />
      )
    );
  }

  function renderSectionHeader({ section }) {
    return <SectionHeader section={section} />;
  }

  if (!account) return null;
  const currency = getAccountCurrency(account);

  const analytics = (
    <TrackScreen
      category="Account"
      currency={currency.id}
      operationsSize={account.operations.length}
    />
  );

  const { sections, completed } = groupAccountOperationsByDay(account, {
    count: opCount,
  });

  return (
    <View style={styles.root}>
      {analytics}
      <List
        ref={ref}
        sections={sections}
        style={styles.sectionList}
        contentContainerStyle={styles.contentContainer}
        ListFooterComponent={
          !completed ? (
            <LoadingFooter />
          ) : sections.length === 0 ? (
            isAccountEmpty(account) ? null : (
              <NoOperationFooter />
            )
          ) : (
            <NoMoreOperationFooter />
          )
        }
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
        accountId={account.id}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "column",
  },
  sectionList: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 22,
    paddingBottom: 4,
    color: colors.darkBlue,
  },
  balanceSubText: {
    fontSize: 16,
    color: colors.smoke,
  },
  contentContainer: {
    paddingBottom: 64,
    flexGrow: 1,
  },
});
