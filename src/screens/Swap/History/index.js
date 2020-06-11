import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Animated, SectionList } from "react-native";
import { useSelector } from "react-redux";
import getCompleteSwapHistory from "@ledgerhq/live-common/lib/swap/getCompleteSwapHistory";
import { accountsSelector } from "../../../reducers/accounts";
import OperationRow from "./OperationRow";
import LText from "../../../components/LText";
import accountSyncRefreshControl from "../../../components/accountSyncRefreshControl";
import colors from "../../../colors";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const List = accountSyncRefreshControl(AnimatedSectionList);

const History = () => {
  const accounts = useSelector(accountsSelector);
  const [sections, setSections] = useState([]);

  const ref = useRef();

  useEffect(() => {
    (async function asyncGetCompleteSwapHistory() {
      // Do the day mapping for this on live-common side
      setSections([
        { day: new Date(), data: await getCompleteSwapHistory(accounts, true) },
      ]);
      setSections([
        { day: new Date(), data: await getCompleteSwapHistory(accounts) },
      ]);
    })();
  }, [accounts, setSections]);

  return (
    <View style={styles.root}>
      <List
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
