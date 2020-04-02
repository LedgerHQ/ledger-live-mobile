/* @flow */
import invariant from "invariant";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { useSelector } from "react-redux";
import i18next from "i18next";

import type { NavigationScreenProp } from "react-navigation";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import {
  useTronSuperRepresentatives,
  useSortedSr,
} from "@ledgerhq/live-common/lib/families/tron/react";

import { accountAndParentScreenSelector } from "../../../../reducers/accounts";
import colors from "../../../../colors";
import { TrackScreen } from "../../../../analytics";
import { defaultNavigationOptions } from "../../../../navigation/navigatorConfig";
import StepHeader from "../../../../components/StepHeader";
import RetryButton from "../../../../components/RetryButton";
import CancelButton from "../../../../components/CancelButton";
import GenericErrorBottomModal from "../../../../components/GenericErrorBottomModal";
import SelectValidatorMain from "./Main";
import type { Section } from "./Main";
import SelectValidatorFooter from "./Footer";
import { getIsVoted } from "./utils";

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

  invariant(transaction, "transaction is required");
  invariant(transaction.votes, "transaction.votes is required");

  const superRepresentatives = useTronSuperRepresentatives();
  const sortedSuperRepresentatives = useSortedSr(
    "",
    superRepresentatives,
    transaction.votes || [],
  );

  const sections = useMemo<Section[]>(
    () => [
      {
        type: "superRepresentatives",
        data: sortedSuperRepresentatives.filter(({ isSR }) => isSR),
      },
      {
        type: "candidates",
        data: sortedSuperRepresentatives.filter(({ isSR }) => !isSR),
      },
    ],
    [sortedSuperRepresentatives],
  );

  // const onChange = useCallback(
  //   (address, vote) => {
  //     setTransaction(
  //       bridge.updateTransaction(transaction, {
  //         amount: getDecimalPart(amount, defaultUnit.magnitude),
  //       }),
  //     );
  //   },
  //   [setTransaction, transaction, bridge, defaultUnit],
  // );

  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearchQuery = useCallback(value => {
    setSearchQuery(value);
  }, []);

  const onSelectSuperRepresentative = useCallback(
    ({ address }) => {
      const isVoted = getIsVoted(transaction, address);
      const newVotes = isVoted
        ? transaction.votes.filter(v => v.address !== address)
        : [...transaction.votes, { address, voteCount: 0 }];
      const tx = bridge.updateTransaction(transaction, {
        votes: newVotes,
      });
      setTransaction(tx);
    },
    [transaction],
  );

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
        <SelectValidatorMain
          sections={sections}
          transaction={transaction}
          onPress={onSelectSuperRepresentative}
          onChangeSearchQuery={onChangeSearchQuery}
        />

        <SelectValidatorFooter
          bridgePending={bridgePending}
          onContinue={onContinue}
          status={status}
          transaction={transaction}
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
  headerStyle: {
    ...defaultNavigationOptions.headerStyle,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topContainer: { paddingHorizontal: 32 },
});
