/* @flow */
import React, { useCallback, useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import { accountScreenSelector } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import { ScreenName } from "../../const";
import PreventNativeBack from "../../components/PreventNativeBack";
import ValidateSuccess from "../../components/ValidateSuccess";
import { context as _wcContext } from "../WalletConnect/Provider";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  message: any,
  signature: String,
};

export default function ValidationSuccess({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const wcContext = useContext(_wcContext);

  useEffect(() => {
    if (wcContext.currentCallRequestId) {
      console.log("success", route.params.signature);
      wcContext.setCurrentCallRequestResult(route.params.signature);
    }
  }, []);

  const onClose = useCallback(() => {
    navigation.dangerouslyGetParent().pop();
  }, [navigation]);

  return (
    <View style={styles.root}>
      <TrackScreen category="SignMessage" name="ValidationSuccess" />
      <PreventNativeBack />
      <ValidateSuccess
        title={t("walletconnect.successTitle")}
        description={t("walletconnect.successDescription")}
        onClose={onClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
