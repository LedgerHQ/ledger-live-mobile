/* @flow */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import { useTheme } from "@react-navigation/native";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";
import network from "@ledgerhq/live-common/lib/network";
import Config from "react-native-config";
import { accountScreenSelector } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import { ScreenName } from "../../const";
import PreventNativeBack from "../../components/PreventNativeBack";
import ValidateSuccess from "../../components/ValidateSuccess";
import {
  // $FlowFixMe
  context as _wcContext,
  // $FlowFixMe
  setCurrentCallRequestResult,
  // $FlowFixMe
  STATUS,
} from "../WalletConnect/Provider";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  deviceId: string,
  transaction: any,
  result: Operation,
};

export default function ValidationSuccess({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const wcContext = useContext(_wcContext);
  const currency = account ? getAccountCurrency(account) : null;

  const params = route?.params;
  const data = params?.data;

  useEffect(() => {
    let paD = {};
    try {
      paD = data
        ? JSON.parse(Buffer.from(data, "base64").toString("utf8"))
        : {};

      fetch(
        "https://fcm.googleapis.com/v1/projects/ledger-live-development/messages:send",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + Config.FIREBASE_SERVER_KEY,
            project_id: Config.FIREBASE_SENDER_ID,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              to: paD.token,
              notification: {
                title: "Payment incoming",
                body: "Your latest payment request is processing",
              },
            },
          }),
        },
      )
        .then(c => {
          console.log(c);
          setSent(true);
        })
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }, [data]);

  useEffect(() => {
    if (!account) return;
    let result = route.params?.result;
    if (!result) return;
    result =
      result.subOperations && result.subOperations[0]
        ? result.subOperations[0]
        : result;

    if (wcContext.currentCallRequestId) {
      setCurrentCallRequestResult(result.hash);
    }
  }, []);

  const onClose = useCallback(() => {
    navigation.getParent().pop();
  }, [navigation]);

  const goToOperationDetails = useCallback(() => {
    if (!account) return;
    const result = route.params?.result;
    if (!result) return;
    navigation.navigate(ScreenName.OperationDetails, {
      disableAllLinks: wcContext.status === STATUS.CONNECTED,
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      operation:
        result.subOperations && result.subOperations[0]
          ? result.subOperations[0]
          : result,
    });
  }, [
    account,
    route.params?.result,
    navigation,
    wcContext.status,
    parentAccount,
  ]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <TrackScreen
        category="SendFunds"
        name="ValidationSuccess"
        currencyName={currency?.name}
      />
      <PreventNativeBack />
      <ValidateSuccess onClose={onClose} onViewDetails={goToOperationDetails} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
