// @flow

import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
// import { getAccountCapabilities } from "@ledgerhq/live-common/lib/compound/logic";
import Row from "../shared/Row";
import colors from "../../../colors";
import EmptyState from "./EmptyState";

type Props = {
  summaries: CompoundAccountSummary[],
};

const ActiveAccounts = ({ summaries }: Props) => {
  return (
    <View style={styles.root}>
      <FlatList
        data={summaries}
        renderItem={({ item, index }) => {
          const { account, parentAccount, totalSupplied } = item;
          return (
            <Row
              key={account.id + index}
              account={account}
              parentAccount={parentAccount}
              value={totalSupplied}
              onPress={() => {}}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => <EmptyState />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.lightGrey,
  },
});

export default ActiveAccounts;
