/* @flow */
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import { Trans } from "react-i18next";
import { TrackScreen } from "../../../analytics";
import colors from "../../../colors";
import PreventNativeBack from "../../../components/PreventNativeBack";
import ValidateSuccess from "../../../components/ValidateSuccess";

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

export default function ValidationSuccess({ navigation }: Props) {
  const onClose = useCallback(() => {
    const n = navigation.dangerouslyGetParent() || navigation;
    n.goBack();
  }, [navigation]);

  return (
    <View style={styles.root}>
      <TrackScreen category="LendingSupplyFlow" name="ValidationSuccess" />
      <PreventNativeBack />
      <ValidateSuccess
        title={<Trans i18nKey="transfer.lending.supply.validation.success" />}
        description={
          <Trans i18nKey="transfer.lending.supply.validation.info" />
        }
        info={<Trans i18nKey="transfer.lending.supply.validation.extraInfo" />}
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
