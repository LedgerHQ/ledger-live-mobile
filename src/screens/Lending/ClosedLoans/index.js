// @flow

import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/native";
import { makeClosedHistoryForAccounts } from "@ledgerhq/live-common/lib/compound/logic";
import colors from "../../../colors";
// import { NavigatorName } from "../../../const";

import { useCompoundSummaries } from "../useCompoundSummaries";
import { flattenSortAccountsSelector } from "../../../actions/general";
import TrackScreen from "../../../analytics/TrackScreen";

import EmptyState from "../shared/EmptyState";
import Row from "../shared/Row";

const forceInset = { bottom: "always" };

export default function ClosedLoans() {
  const { t } = useTranslation();
  const accounts = useSelector(flattenSortAccountsSelector);
  const summaries = useCompoundSummaries(accounts);
  const closedLoans = makeClosedHistoryForAccounts(summaries);
  // const navigation = useNavigation();

  const navigateToCompoundDashboard = useCallback(() => {}, []);

  return (
    <SafeAreaView style={[styles.root]} forceInset={forceInset}>
      <TrackScreen category="Lending" />
      <View style={styles.body}>
        {closedLoans.length > 0 ? (
          <View style={styles.rows}>
            {closedLoans.map((loan, i) => {
              const { account, parentAccount, amountSupplied, endDate } = loan;
              return (
                <>
                  {i > 0 && (
                    <View
                      key={`${endDate.toDateString()}${i}`}
                      style={styles.separator}
                    />
                  )}
                  <Row
                    key={`${endDate.toDateString()}${i}`}
                    account={account}
                    parentAccount={parentAccount}
                    value={amountSupplied}
                    onPress={() => {}}
                  />
                </>
              );
            })}
          </View>
        ) : (
          <EmptyState
            title={t("transfer.lending.closedLoans.tabTitle")}
            description={t("transfer.lending.closedLoans.description")}
            buttonLabel={t("transfer.lending.closedLoans.cta")}
            onClick={navigateToCompoundDashboard}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  rows: {
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.lightGrey,
  },
  body: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: 16,
  },
});
