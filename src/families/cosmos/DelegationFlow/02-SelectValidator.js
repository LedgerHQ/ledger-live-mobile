// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";

import type { Transaction } from "@ledgerhq/live-common/lib/types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import { accountScreenSelector } from "../../../reducers/accounts";
import colors from "../../../colors";
import { ScreenName } from "../../../const";
import Button from "../../../components/Button";

type RouteParams = {
  accountId: string,
  transaction: Transaction,
};

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

function DelegationSelectValidator({ navigation, route }: Props) {
  const { account } = useSelector(accountScreenSelector(route));

  invariant(
    account && account.cosmosResources,
    "account and cosmos resources required",
  );

  const mainAccount = getMainAccount(account, undefined);
  const bridge = getAccountBridge(account, undefined);

  const { cosmosResources } = account;

  const { transaction, status } = useBridgeTransaction(() => {
    const tx = route.params.transaction;

    if (!tx) {
      const t = bridge.createTransaction(mainAccount);
      const delegations = cosmosResources.delegations || [];

      return {
        account,
        transaction: bridge.updateTransaction(t, {
          mode: "delegate",
          validators: delegations.map(({ validatorAddress, amount }) => ({
            address: validatorAddress,
            amount,
          })),
          /** @TODO remove this once the bridge handles it */
          recipient: mainAccount.freshAddress,
        }),
      };
    }

    return { account, transaction: tx };
  });

  const onNext = useCallback(() => {
    navigation.navigate(ScreenName.CosmosDelegationConnectDevice, {
      ...route.params,
      transaction,
      status,
    });
  }, [navigation, route.params, transaction, status]);

  const onSelect = useCallback(() => {
    navigation.navigate(ScreenName.CosmosDelegationAmount, {
      ...route.params,
      transaction,
      status,
    });
  }, [navigation, route.params, transaction, status]);

  const onCancel = useCallback(() => {
    navigation.dangerouslyGetParent().pop();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.main}>
        <Button type="primary" title="go amount" event="" onPress={onSelect} />
      </View>

      <View style={styles.footer}>
        <Button
          event="Cosmos DelegationSelectValidatorContinueBtn"
          onPress={onNext}
          title={
            <Trans i18nKey="cosmos.delegation.flow.validator.button.continue" />
          }
          type="primary"
        />
        <Button
          event="Cosmos DelegationSelectValidatorCancelBtn"
          onPress={onCancel}
          title={<Trans i18nKey="common.cancel" />}
          type="secondary"
          outline={false}
          containerStyle={styles.buttonContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.grey,
    textAlign: "center",
    marginVertical: 16,
  },
  footer: {
    alignSelf: "stretch",
  },
  buttonContainer: {
    marginTop: 4,
  },
  howVotingWorks: {
    marginTop: 32,
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.live,
    flexDirection: "row",
  },
});

export default DelegationSelectValidator;
