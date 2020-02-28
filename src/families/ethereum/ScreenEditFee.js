// @flow
import React from "react";
import { StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { i18n } from "../../context/Locale";
import colors from "../../colors";
import { accountAndParentScreenSelector } from "../../reducers/accounts";
import KeyboardView from "../../components/KeyboardView";
import EditFeeUnitEthereum from "./EditFeeUnitEthereum";

const forceInset = { bottom: "always" };

const options = {
  title: i18n.t("send.fees.title"),
  headerLeft: null,
};

function EthereumEditFee() {
  const { account, parentAccount } = useSelector(
    accountAndParentScreenSelector,
  );
  const route = useRoute();
  const transaction = route.params?.transaction;

  if (!transaction) return null;

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <KeyboardView style={styles.container}>
        <EditFeeUnitEthereum
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
        />
      </KeyboardView>
    </SafeAreaView>
  );
}

export { options, EthereumEditFee as component };

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
});
