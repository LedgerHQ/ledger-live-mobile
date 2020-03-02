// @flow
import React from "react";
import { StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import colors from "../../colors";
import { i18n } from "../../context/Locale";
import { accountScreenSelector } from "../../reducers/accounts";
import KeyboardView from "../../components/KeyboardView";
import EditFeeUnit from "../../components/EditFeeUnit";

const forceInset = { bottom: "always" };

const options = {
  title: i18n.t("send.fees.title"),
  headerLeft: null,
};

// interface RouteParams {
//   accountId: string;
//   transaction: Transaction;
// }

function RippleEditFee() {
  const account = useSelector(accountScreenSelector);
  const route = useRoute();
  const transaction = route.params?.transaction;

  if (!transaction) return null;

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <KeyboardView style={styles.container}>
        <EditFeeUnit account={account} field="fee" />
      </KeyboardView>
    </SafeAreaView>
  );
}

export { options, RippleEditFee as component };

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
});
