// @flow
import React, { useCallback, useMemo, useEffect } from "react";

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

export default function SendAmountNFT({ route }: Props) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { colors } = useTheme();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));

  const bridge = useMemo(() => getAccountBridge(account, parentAccount), [
    account,
    parentAccount,
  ]);
  const {
    transaction,
    setTransaction,
    status,
    bridgePending,
  } = useBridgeTransaction(() => ({
    transaction: route.params.transaction,
    account,
    parentAccount,
  }));

  const onQuantityChange = useCallback(
    text => {
      const newQuantity = text ? new BigNumber(text.replace(/\D/g, "")) : null;

      setTransaction(
        bridge.updateTransaction(transaction, {
          quantities: [newQuantity],
        }),
      );
    },
    [bridge, setTransaction, transaction],
  );
  // Set the quantity as null as a start to allow the placeholder to appear
  useEffect(() => {
    setTransaction(
      bridge.updateTransaction(transaction, {
        quantities: [null],
      }),
    );
  }, []);
  const quantity = useMemo(() => transaction.quantities?.[0]?.toNumber(), [
    transaction.quantities,
  ]);

  const nft = account?.nfts?.find(
    nft =>
      nft.collection.contract === transaction?.collection &&
      nft.tokenId === transaction?.tokenIds[0],
  );

  const onContinue = useCallback(() => {
    navigation.navigate(ScreenName.SendSummary, {
      accountId: account?.id,
      parentId: parentAccount?.id,
      transaction,
    });
  }, [account, parentAccount, navigation, transaction]);

  const error = (() => {
    if (status?.warnings?.amount) {
      return (
        <LText style={styles.error} color={"orange"} numberOfLines={2}>
          <TranslatedError error={status?.warnings?.amount} />
        </LText>
      );
    }

    if (status?.errors?.amount) {
      return (
        <LText style={styles.error} color={"alert"} numberOfLines={2}>
          <TranslatedError error={status?.errors?.amount} />
        </LText>
      );
    }

    return <LText style={styles.error} numberOfLines={2} />;
  })();

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
              keyboardType="numeric"
              value={quantity}
              onChangeText={onQuantityChange}
              placeholder="0"
            />
            {error}
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
    padding: 16,
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
