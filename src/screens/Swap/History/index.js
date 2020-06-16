import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Animated, SectionList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import getCompleteSwapHistory from "@ledgerhq/live-common/lib/swap/getCompleteSwapHistory";
import updateAccountSwapStatus from "@ledgerhq/live-common/lib/swap/updateAccountSwapStatus";
import { updateAccountWithUpdater } from "../../../actions/accounts";
import { accountsSelector } from "../../../reducers/accounts";
import OperationRow from "./OperationRow";
import LText from "../../../components/LText";
import colors from "../../../colors";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const History = () => {
  const accounts = useSelector(accountsSelector);
  const dispatch = useDispatch();
  const [sections, setSections] = useState([]);
  const ref = useRef();

  const accountsRef = useRef(accounts);

  useEffect(() => {
    accountsRef.current = accounts;
  }, [accounts]);

  useEffect(() => {
    (async function asyncGetCompleteSwapHistory() {
      setSections(await getCompleteSwapHistory(accounts));
    })();
  }, [accounts, setSections]);

  useEffect(() => {
    (async function asyncUpdateAccountSwapStatus() {
      const newAccounts = await Promise.all(
        accountsRef.current.map(updateAccountSwapStatus),
      );
      newAccounts.forEach(account =>
        dispatch(
          updateAccountWithUpdater(account.id, a =>
            account === a ? null : account,
          ),
        ),
      );
    })();
  }, [dispatch]);

  return (
    <View style={styles.root}>
      <AnimatedSectionList
        ref={ref}
        sections={sections}
        style={styles.sectionList}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={_ => {
          return <LText>{"Placeholder for history"}</LText>;
        }}
        keyExtractor={({ swapId }) => swapId}
        renderItem={OperationRow}
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
    backgroundColor: colors.lightFog,
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
