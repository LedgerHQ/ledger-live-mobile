/* @flow */
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { TrackScreen } from "../../../analytics";
import colors from "../../../colors";
import PreventNativeBack from "../../../components/PreventNativeBack";
import ValidateSuccess from "../../../components/ValidateSuccess";
import { accountScreenSelector } from "../../../reducers/accounts";
import { ScreenName } from "../../../const";

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
  const onClose = useCallback(() => {
    const n = navigation.dangerouslyGetParent() || navigation;
    n.goBack();
  }, [navigation]);

  const { account, parentAccount } = useSelector(accountScreenSelector(route));

  const goToOperationDetails = useCallback(() => {
    if (!account) return;
    const result = route.params?.result;
    if (!result) return;
    navigation.navigate(ScreenName.OperationDetails, {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      operation:
        result.subOperations && result.subOperations[0]
          ? result.subOperations[0]
          : result,
    });
  }, [account, route.params?.result, navigation, parentAccount]);

  return (
    <View style={styles.root}>
      <TrackScreen category="LendingWithdrawFlow" name="ValidationSuccess" />
      <PreventNativeBack />
      <ValidateSuccess
        title={<Trans i18nKey="transfer.lending.withdraw.validation.success" />}
        description={
          <Trans i18nKey="transfer.lending.withdraw.validation.info" />
        }
        onViewDetails={goToOperationDetails}
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
