// @flow
import invariant from "invariant";
import React, { useMemo } from "react";
import { translate } from "react-i18next";
import type { TFunction } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { SectionList } from "react-navigation";
import {
  useTronSuperRepresentatives,
  useSortedSr,
} from "@ledgerhq/live-common/lib/families/tron/react";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import colors from "../../../../colors";
import LText from "../../../../components/LText";

type Props = {
  transaction: Transaction,
  t: TFunction,
};

function SelectValidatorMain({ transaction, t }: Props) {
  invariant(transaction, "transaction is required");

  const superRepresentatives = useTronSuperRepresentatives();
  const sortedSuperRepresentatives = useSortedSr(
    "",
    superRepresentatives,
    transaction.votes || [],
  );

  const sections = useMemo(
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

  return (
    <SectionList
      sections={sections}
      keyExtractor={({ address }, i) => address + i}
      renderItem={({ item }) => (
        <View>
          <LText style={{ color: colors.darkBlue }}>
            {JSON.stringify(item, null, 2)}
          </LText>
        </View>
      )}
      renderSectionHeader={({ section: { type } }) => (
        <LText>
          {t(`tron.voting.flow.selectValidator.sections.title.${type}`)}
        </LText>
      )}
    />
  );
}

export default translate()(SelectValidatorMain);

const styles = StyleSheet.create({});
