// @flow
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { BigNumber } from "bignumber.js";
import colors from "../../../colors";
import { accountScreenSelector } from "../../../reducers/accounts";
import Button from "../../../components/Button";
import KeyboardView from "../../../components/KeyboardView";
import FeesRow from "./FeesRow";
import CustomFeesRow from "./CustomFeesRow";
import { track } from "../../../analytics";
import { i18n } from "../../../context/Locale";

const forceInset = { bottom: "always" };

const options = {
  title: i18n.t("operationDetails.title"),
  headerLeft: null,
};

function BitcoinEditFeePerByte() {
  const account = useSelector(accountScreenSelector);
  const route = useRoute();
  const { navigate } = useNavigation();

  const transaction = route.params?.transaction;
  const [feePerByte, setFeePerByte] = useState(transaction.feePerByte);
  const items = transaction.networkInfo
    ? transaction.networkInfo.feeItems.items
    : [];
  const selectedItem =
    feePerByte &&
    items.find(item => item.feePerByte && item.feePerByte.eq(feePerByte));
  const [focusedItemKey, setFocusedItemKey] = useState(
    selectedItem ? selectedItem.key : "custom",
  );
  const [error, setError] = useState();

  function onChangeCustomFeeRow(feePerByte: BigNumber) {
    setFeePerByte(feePerByte);
    setFocusedItemKey("custom");
    setError(!feePerByte.isGreaterThan(0));
    track("SendChangeCustomFees");
  }

  function onChangeFeeRow(feePerByte: ?BigNumber, key: string) {
    setFeePerByte(feePerByte);
    setFocusedItemKey(key);
    setError(undefined);
    Keyboard.dismiss();
  }

  function onValidateFees() {
    const bridge = getAccountBridge(account);
    Keyboard.dismiss();

    navigate("SendSummary", {
      accountId: account.id,
      transaction: bridge.updateTransaction(transaction, { feePerByte }),
    });
  }

  if (!transaction) return null;

  const isCustom = focusedItemKey === "custom";

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <KeyboardView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {items.map(item => (
              <FeesRow
                key={item.key}
                itemKey={item.key}
                title={<Trans i18nKey={`fees.speed.${item.speed}`} />}
                value={item.feePerByte}
                isSelected={item.key === focusedItemKey}
                onPress={onChangeFeeRow}
              />
            ))}
            <CustomFeesRow
              initialValue={isCustom ? feePerByte : null}
              title={<Trans i18nKey="fees.speed.custom" />}
              isValid={!error}
              onPress={onChangeCustomFeeRow}
              isSelected={isCustom}
            />
            <View style={styles.buttonContainer}>
              <Button
                event="BitcoinEditFeePerByteContinue"
                type="primary"
                disabled={!!error}
                title={<Trans i18nKey="send.fees.validate" />}
                containerStyle={styles.continueButton}
                onPress={onValidateFees}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardView>
    </SafeAreaView>
  );
}

export { options, BitcoinEditFeePerByte as component };

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    flexDirection: "column",
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
  },
  continueButton: {
    alignSelf: "stretch",
  },
  container: {
    flex: 1,
  },
  error: {
    alignSelf: "center",
    color: colors.alert,
    fontSize: 14,
    marginBottom: 8,
  },
});
