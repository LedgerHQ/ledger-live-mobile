import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  SectionList,
  RefreshControl,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import getCompleteSwapHistory from "@ledgerhq/live-common/lib/swap/getCompleteSwapHistory";
import updateAccountSwapStatus from "@ledgerhq/live-common/lib/swap/updateAccountSwapStatus";
import { updateAccountWithUpdater } from "../../../actions/accounts";
import { flattenAccountsSelector } from "../../../reducers/accounts";
import OperationRow from "./OperationRow";
import EmptyState from "./EmptyState";
import LText from "../../../components/LText";
import colors from "../../../colors";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const History = () => {
  const accounts = useSelector(flattenAccountsSelector);
  const dispatch = useDispatch();
  const [sections, setSections] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const ref = useRef();

  const accountsRef = useRef(accounts);

  useEffect(() => {
    accountsRef.current = accounts;
  }, [accounts]);

  useEffect(() => {
    setSections(getCompleteSwapHistory(accountsRef.current));
  }, [setSections]);

  useEffect(() => {
    let cancelled = false;
    async function asyncUpdateAccountSwapStatus() {
      const newAccounts = await Promise.all(
        accountsRef.current.map(updateAccountSwapStatus),
      );
      if (cancelled) return;
      newAccounts.forEach(account =>
        dispatch(
          updateAccountWithUpdater(account.id, a =>
            account === a ? null : account,
          ),
        ),
      );
      setIsRefreshing(false);
    }

    if (isRefreshing) {
      asyncUpdateAccountSwapStatus();
    }

    return () => {
      cancelled = true;
    };
  }, [isRefreshing, dispatch]);

  // NB if renderItem={OperationRow} it crashes ¯\_(ツ)_/¯
  const renderItem = ({ item }: { item: Operation }) => (
    <OperationRow item={item} />
  );

  return (
    <View style={styles.root}>
      <AnimatedSectionList
        ref={ref}
        sections={sections}
        style={styles.sectionList}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={_ => {
          return <EmptyState />;
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => setIsRefreshing(true)}
          />
        }
        keyExtractor={({ swapId }) => swapId}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => {
          return (
            <LText semiBold style={styles.section}>
              {section.day.toDateString()}
            </LText>
          );
        }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "column",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 19,
    color: colors.grey,
  },
  sectionList: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 64,
    flexGrow: 1,
  },
});

export default History;
