/* @flow */
import invariant from "invariant";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { useSelector } from "react-redux";
import i18next from "i18next";

import type { NavigationScreenProp } from "react-navigation";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import { accountAndParentScreenSelector } from "../../../../reducers/accounts";
import colors from "../../../../colors";
import { TrackScreen } from "../../../../analytics";
import StepHeader from "../../../../components/StepHeader";
import RetryButton from "../../../../components/RetryButton";
import CancelButton from "../../../../components/CancelButton";
import GenericErrorBottomModal from "../../../../components/GenericErrorBottomModal";
import SelectValidatorMain from "./Main";
import SelectValidatorFooter from "./Footer";

const forceInset = { bottom: "always" };

type Props = {
  navigation: NavigationScreenProp<{
    params: {
      accountId: string,
      transaction: Transaction,
    },
  }>,
};

export default function SelectValidator({ navigation }: Props) {
  const { account } = useSelector(state =>
    accountAndParentScreenSelector(state, { navigation }),
  );
  invariant(
    account && account.tronResources,
    "account and tron resources required",
  );

  const bridge = getAccountBridge(account, undefined);

  const {
    transaction,
    status,
    setTransaction,
    bridgeError,
    bridgePending,
  } = useBridgeTransaction(() => {
    const tx = bridge.createTransaction(account);

    const { tronResources } = account;
    const { votes } = tronResources;

    const transaction = bridge.updateTransaction(tx, {
      mode: "vote",
      votes,
    });

    return { account, transaction };
  });

  // const onChange = useCallback(
  //   (address, vote) => {
  //     /** @TODO update vote transaction */
  //     // setTransaction(
  //     //   bridge.updateTransaction(transaction, {
  //     //     amount: getDecimalPart(amount, defaultUnit.magnitude),
  //     //   }),
  //     // );
  //   },
  //   [setTransaction, transaction, bridge, defaultUnit],
  // );

  const onContinue = useCallback(() => {
    navigation.navigate("CastVote", {
      accountId: account.id,
      transaction,
      status,
    });
  }, [account, navigation, transaction, status]);

  const onBridgeErrorCancel = useCallback(() => {
    const parent = navigation.dangerouslyGetParent();
    if (parent) parent.goBack();
  }, [navigation]);

  const onBridgeErrorRetry = useCallback(() => {
    if (!transaction) return;
    setTransaction(bridge.updateTransaction(transaction, {}));
  }, [setTransaction, transaction, bridge]);

  if (!account || !transaction) return null;

  // const error = bridgePending ? null : status.errors.votes;
  // const warning = status.warnings.votes;

  return (
    <>
      <TrackScreen category="Vote" name="SelectValidator" />

      <SafeAreaView style={styles.root} forceInset={forceInset}>
        <SelectValidatorMain />

        <SelectValidatorFooter
          bridgePending={bridgePending}
          onContinue={onContinue}
          status={status}
        />
      </SafeAreaView>

      <GenericErrorBottomModal
        error={bridgeError}
        onClose={onBridgeErrorRetry}
        footerButtons={
          <>
            <CancelButton
              containerStyle={styles.button}
              onPress={onBridgeErrorCancel}
            />
            <RetryButton
              containerStyle={[styles.button, styles.buttonRight]}
              onPress={onBridgeErrorRetry}
            />
          </>
        }
      />
    </>
  );
}

SelectValidator.navigationOptions = {
  headerTitle: (
    <StepHeader
      title={i18next.t("vote.stepperHeader.selectValidator")}
      subtitle={i18next.t("vote.stepperHeader.stepRange", {
        currentStep: "1",
        totalSteps: "4",
      })}
    />
  ),
  headerLeft: null,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topContainer: { paddingHorizontal: 32 },
});
