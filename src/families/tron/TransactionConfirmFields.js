// @flow
import invariant from "invariant";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import type { Transaction } from "@ledgerhq/live-common/lib/types";

import { shortAddressPreview } from "@ledgerhq/live-common/lib/account";
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
  lineLabel: { justifyContent: "flex-start" },
  validatorLabel: { fontSize: 12, color: colors.grey },
});

const Warning = ({ transaction }: { transaction: Transaction }) => {
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

const TronResourceField = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "tron", "tron transaction");

  const { resource } = transaction;

  return (
    resource && (
      <DataRow label="Resource">
        <LText semiBold style={styles.text}>
          {resource.slice(0, 1).toUpperCase() + resource.slice(1).toLowerCase()}
        </LText>
      </DataRow>
    )
  );
};

const TronVotesField = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "tron", "tron transaction");

  const { votes } = transaction;

  const sp = useTronSuperRepresentatives();
  const formattedVotes =
    votes && votes.length > 0 ? formatVotes(votes, sp) : null;

  return formattedVotes ? (
    <>
      <DataRow>
        <LText style={[styles.text, styles.greyText, { textAlign: "left" }]}>
          <Trans i18nKey="ValidateOnDevice.name" />
        </LText>
        <LText style={[styles.text, styles.greyText]}>
          <Trans i18nKey="ValidateOnDevice.votes" />
        </LText>
      </DataRow>

      {formattedVotes.map(({ address, voteCount, validator }) => (
        <DataRow key={address}>
          <View style={styles.lineLabel}>
            <LText semiBold>{shortAddressPreview(address)}</LText>
            <LText style={styles.validatorLabel}>
              {validator && validator.name}
            </LText>
          </View>
          <LText semiBold style={styles.text}>
            {voteCount}
          </LText>
        </DataRow>
      ))}
    </>
  ) : null;
};

const fieldComponents = {
  "tron.resource": TronResourceField,
  "tron.votes": TronVotesField,
};

export default {
  fieldComponents,
  warning: Warning,
  disableFees: () => true,
};
