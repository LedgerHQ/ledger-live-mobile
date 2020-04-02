// @flow
import invariant from "invariant";
import React from "react";
import { StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import type {
  AccountLike,
  Account,
  Transaction,
} from "@ledgerhq/live-common/lib/types";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import {
  formatVotes,
  useTronSuperRepresentatives,
} from "@ledgerhq/live-common/lib/families/tron/react";

import { DataRow } from "../../components/ValidateOnDeviceDataRow";
import LText from "../../components/LText";
import Info from "../../icons/Info";
import colors from "../../colors";

const styles = StyleSheet.create({
  infoRow: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  infoText: {
    color: colors.live,
    textAlign: "left",
    marginLeft: 8,
  },
  text: {
    color: colors.darkBlue,
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  greyText: {
    color: colors.grey,
  },
});

const InfoSection = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "tron", "tron transaction");

  switch (transaction.mode) {
    case "claimReward":
    case "unfreeze":
    case "freeze":
      return (
        <DataRow>
          <Info size={22} color={colors.live} />
          <LText
            semiBold
            style={[styles.text, styles.infoText]}
            numberOfLines={2}
          >
            <Trans
              i18nKey={`ValidateOnDevice.infoWording.${transaction.mode}`}
              values={{ resource: (transaction.resource || "").toLowerCase() }}
            />
          </LText>
        </DataRow>
      );
    default:
      return null;
  }
};

const Post = ({
  account,
  parentAccount,
  transaction,
}: {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  t: *,
}) => {
  const mainAccount = getMainAccount(account, parentAccount);

  invariant(transaction.family === "tron", "tron transaction");

  const sp = useTronSuperRepresentatives();
  const formattedVotes =
    transaction.votes &&
    transaction.votes.length &&
    formatVotes(transaction.votes, sp);

  const from =
    account.type === "ChildAccount"
      ? account.address
      : mainAccount.freshAddress;

  return (
    <>
      {formattedVotes && formattedVotes.length > 0 ? (
        <>
          <DataRow>
            <LText
              style={[styles.text, styles.greyText, { textAlign: "left" }]}
            >
              <Trans i18nKey="ValidateOnDevice.name" />
            </LText>
            <LText style={[styles.text, styles.greyText]}>
              <Trans i18nKey="ValidateOnDevice.amount" />
            </LText>
          </DataRow>
          {formattedVotes.map(({ address, voteCount, validator }) => (
            <DataRow key={address}>
              <LText semiBold>{(validator && validator.name) || address}</LText>
              <LText semiBold style={styles.text}>
                {voteCount}
              </LText>
            </DataRow>
          ))}
        </>
      ) : null}
      <DataRow label={<Trans i18nKey="ValidateOnDevice.fromAddress" />}>
        <LText semiBold style={styles.text}>
          {from}
        </LText>
      </DataRow>
      {transaction.recipient && transaction.recipient !== from ? (
        <DataRow label={<Trans i18nKey="ValidateOnDevice.toAddress" />}>
          <LText semiBold style={styles.text}>
            {transaction.recipient}
          </LText>
        </DataRow>
      ) : null}
      {transaction.resource && (
        <DataRow label={<Trans i18nKey="ValidateOnDevice.resource" />}>
          <LText semiBold style={styles.text}>
            {(transaction.resource || "").toLowerCase()}
          </LText>
        </DataRow>
      )}
      <InfoSection transaction={transaction} />
    </>
  );
};

const Pre = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "tron", "tron transaction");

  return null;
};

export default {
  pre: Pre,
  post: Post,
};
