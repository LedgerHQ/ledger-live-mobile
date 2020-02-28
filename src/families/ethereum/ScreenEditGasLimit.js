/* @flow */
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { BigNumber } from "bignumber.js";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { i18n } from "../../context/Locale";
import colors from "../../colors";
import Button from "../../components/Button";
import KeyboardView from "../../components/KeyboardView";
import { accountAndParentScreenSelector } from "../../reducers/accounts";

const forceInset = { bottom: "always" };

const options = {
  title: i18n.t("send.summary.gasLimit"),
  headerLeft: null,
};

function EthereumEditGasLimit() {
  const { t } = useTranslation();
  const { account, parentAccount } = useSelector(
    accountAndParentScreenSelector,
  );
  const { navigate } = useNavigation();
  const route = useRoute();
  const transaction = route.params?.transaction;
  const [gasLimit, setGasLimit] = useState(
    transaction.userGasLimit || transaction.estimatedGasLimit,
  );

  function onValidateText() {
    const bridge = getAccountBridge(account, parentAccount);

    Keyboard.dismiss();
    navigate("SendSummary", {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      transaction: bridge.updateTransaction(transaction, {
        userGasLimit: BigNumber(gasLimit),
      }),
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={forceInset}>
      <KeyboardView style={styles.body}>
        <ScrollView contentContainerStyle={styles.root}>
          <TextInput
            autoFocus
            style={styles.textInputAS}
            defaultValue={gasLimit ? gasLimit.toString() : ""}
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={10}
            onChangeText={setGasLimit}
            onSubmitEditing={onValidateText}
          />

          <View style={styles.flex}>
            <Button
              event="EthereumSetGasLimit"
              type="primary"
              title={t("send.summary.validateGasLimit")}
              onPress={onValidateText}
              containerStyle={styles.buttonContainer}
            />
          </View>
        </ScrollView>
      </KeyboardView>
    </SafeAreaView>
  );
}

export { options, EthereumEditGasLimit as component };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: colors.white,
  },
  textInputAS: {
    padding: 16,
    fontSize: 30,
    color: colors.darkBlue,
  },
  buttonContainer: {
    marginHorizontal: 16,
  },
  flex: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
});
