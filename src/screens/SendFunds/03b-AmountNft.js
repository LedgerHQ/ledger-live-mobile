// @flow
import React, { useCallback, useState, useEffect } from "react";

import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation, useTheme } from "@react-navigation/native";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { View, StyleSheet, SafeAreaView, TextInput } from "react-native";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import type { Transaction } from "@ledgerhq/live-common/lib/types";

import { accountScreenSelector } from "../../reducers/accounts";
import TranslatedError from "../../components/TranslatedError";
import KeyboardView from "../../components/KeyboardView";
import Button from "../../components/Button";
import LText from "../../components/LText";
import { ScreenName } from "../../const";

const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: {
    params: {
      accountId: string,
      transaction: Transaction,
    },
  },
};

export default function SendAmountCoin({ route }: Props) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { colors } = useTheme();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState({});

  const {
    transaction,
    setTransaction,
    status,
    bridgePending,
    // bridgeError,
  } = useBridgeTransaction(() => ({
    transaction: route.params.transaction,
    account,
    parentAccount,
  }));

  useEffect(() => {
    const bridge = getAccountBridge(account, parentAccount);
    setTransaction(
      bridge.updateTransaction(transaction, {
        quantities: [new BigNumber(quantity ?? 0)],
      }),
    );
  }, [quantity]);

  useEffect(() => {
    let err = {};

    if (status?.warnings?.amount) {
      err = {
        type: "warning",
        content: status?.warnings?.amount,
      };
    }
    if (status?.errors?.amount) {
      err = {
        type: "error",
        content: status?.errors?.amount,
      };
    }

    setError(err);
  }, [status]);

  const nft = account?.nfts?.find(
    nft =>
      nft.collection.contract === transaction?.collection &&
      nft.tokenId === transaction?.tokenIds[0],
  );
  const onChangeText = useCallback(
    value => {
      setQuantity(value?.startsWith("0") ? value.substring(1) : value);
    },
    [setQuantity],
  );

  const onContinue = useCallback(() => {
    navigation.navigate(ScreenName.SendSummary, {
      accountId: account?.id,
      parentId: parentAccount?.id,
      transaction,
    });
  }, [account, parentAccount, navigation, transaction]);

  return (
    <>
      <SafeAreaView
        style={[styles.root, { backgroundColor: colors.background }]}
        forceInset={forceInset}
      >
        <KeyboardView style={styles.container}>
          <View style={styles.amountContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.black,
                },
              ]}
              autoCorrect={false}
              autoFocus={true}
              caretHidden={true}
              editable={true}
              multiline={false}
              keyboardType="number-pad"
              value={quantity}
              onChangeText={onChangeText}
              placeholder="0"
            />
            <LText
              style={styles.error}
              color={error?.type === "error" ? "alert" : "orange"}
              numberOfLines={2}
            >
              <TranslatedError error={error.content} />
            </LText>
          </View>
          <View style={styles.availableContainer}>
            <LText style={styles.available}>
              {t("send.amount.quantityAvailable")} :{"  "}
            </LText>
            <LText bold style={styles.available}>
              {nft?.amount?.toFixed()}
            </LText>
          </View>
          <View style={styles.continueContainer}>
            <Button
              type="primary"
              title={
                !bridgePending
                  ? t("common.continue")
                  : t("send.amount.loadingNetwork")
              }
              onPress={onContinue}
              disabled={!quantity || !!status.errors.amount || bridgePending}
            />
          </View>
        </KeyboardView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  amountContainer: {
    flexGrow: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 50,
    textAlign: "center",
    width: "100%",
    height: 40,
  },
  error: {
    width: "100%",
    height: 40,
    textAlign: "center",
    marginTop: 10,
  },
  availableContainer: {
    flexDirection: "row",
    flexGrow: 0,
    justifyContent: "center",
    paddingBottom: 16,
  },
  available: {
    textAlign: "center",
  },
  continueContainer: {
    flexGrow: 0,
    alignSelf: "stretch",
    alignItems: "stretch",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
});
