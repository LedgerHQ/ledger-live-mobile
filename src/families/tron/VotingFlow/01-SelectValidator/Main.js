// @flow
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React, { useCallback, useMemo, useState } from "react";
import { translate } from "react-i18next";
import type { TFunction } from "react-i18next";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SectionList } from "react-navigation";
import {
  useTronSuperRepresentatives,
  useSortedSr,
} from "@ledgerhq/live-common/lib/families/tron/react";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import colors from "../../../../colors";
import CheckBox from "../../../../components/CheckBox";
import LText from "../../../../components/LText";
import Trophy from "../../../../icons/Trophy";

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

  const [selected, setSelected] = useState<{
    [address: string]: true,
  }>({});

  console.log(JSON.stringify(sortedSuperRepresentatives[0], null, 2));

  const onPressItemCreator = useCallback(
    ({ address }) => () => {
      const isSelected = !!selected[address];
      setSelected({ ...selected, [address]: isSelected ? undefined : true });
    },
    [selected],
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={({ address }, i) => address + i}
      renderItem={({ item, index }) => {
        const { sr } = item;

        return (
          <TouchableOpacity onPress={onPressItemCreator(item)}>
            <View>
              <Trophy size={16} color={colors.darkBlue} />
            </View>

            <View>
              <LText>
                {index + 1}. {sr.name}
              </LText>
              <LText>
                {BigNumber(sr.voteCount).toFormat()} ({sr.brokerage}%)
              </LText>
            </View>

            <View>
              <LText>{"6,8"} %</LText>
              <LText>Est. yield</LText>
            </View>

            <View>
              <CheckBox isChecked={!!selected[sr.address]} />
            </View>
          </TouchableOpacity>
        );
      }}
      renderSectionHeader={({ section: { type } }) => (
        <View>
          <LText>
            {t(`tron.voting.flow.selectValidator.sections.title.${type}`)}
          </LText>
        </View>
      )}
    />
  );
}

export default translate()(SelectValidatorMain);

const styles = StyleSheet.create({});
