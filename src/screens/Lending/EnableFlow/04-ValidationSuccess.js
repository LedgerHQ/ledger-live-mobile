/* @flow */
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import { accountScreenSelector } from "../../../reducers/accounts";
import { TrackScreen } from "../../../analytics";
import colors from "../../../colors";
import PreventNativeBack from "../../../components/PreventNativeBack";
import ValidateSuccess from "../../../components/ValidateSuccess";
import UpdateIcon from "../../../icons/Update";
import { Trans } from "react-i18next";

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
  const { account, parentAccount } = useSelector(accountScreenSelector(route));

  const onClose = useCallback(() => {
    navigation.dangerouslyGetParent().pop();
  }, [navigation]);

  return (
    <View style={styles.root}>
      <TrackScreen category="LendingEnableFlow" name="ValidationSuccess" />
      <PreventNativeBack />
      <ValidateSuccess
        icon={<UpdateIcon size={24} color={colors.live} />}
        iconColor={colors.live}
        title={<Trans i18nKey="transfer.lending.enable.validation.success" />}
        description={
          <Trans i18nKey="transfer.lending.enable.validation.info" />
        }
        info={<Trans i18nKey="transfer.lending.enable.validation.extraInfo" />}
        onLearnMore={() => {
          /** @TODO redirect to support page */
        }}
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
