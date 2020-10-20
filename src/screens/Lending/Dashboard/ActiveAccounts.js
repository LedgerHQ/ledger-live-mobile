// @flow

import React from "react";
import { View, StyleSheet } from "react-native";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
// import { getAccountCapabilities } from "@ledgerhq/live-common/lib/compound/logic";
import Row from "../shared/Row";
import colors from "../../../colors";

type Props = {
  summaries: CompoundAccountSummary[],
};

const ActiveAccounts = ({ summaries }: Props) => {
  return (
    <View style={styles.root}>
      {summaries.map((summary, i) => {
        const { account, parentAccount, totalSupplied } = summary;
        return (
          <>
            {i > 0 && <View style={styles.separator} />}
            <Row
              key={account.id}
              account={account}
              parentAccount={parentAccount}
              value={totalSupplied}
              onPress={() => {}}
            />
          </>
        );
      })}
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
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 8,
    height: 70,
  },
  currencySection: { paddingHorizontal: 8, flex: 1 },
  alignEnd: {
    alignItems: "flex-end",
  },
  title: {
    lineHeight: 17,
    fontSize: 14,
    color: colors.darkBlue,
  },
  subTitle: {
    lineHeight: 15,
    fontSize: 12,
    color: colors.grey,
  },
});

export default ActiveAccounts;
