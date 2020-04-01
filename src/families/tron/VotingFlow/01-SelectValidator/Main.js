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
import colors, { lighten } from "../../../../colors";
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
      renderSectionHeader={({ section: { type } }) => (
        <View style={styles.headerWrapper}>
          <LText style={styles.headerText}>
            {t(`tron.voting.flow.selectValidator.sections.title.${type}`)}
          </LText>
        </View>
      )}
      renderItem={({ item, index }) => {
        const { sr } = item;

        return (
          <TouchableOpacity
            onPress={onPressItemCreator(item)}
            style={styles.wrapper}
          >
            <View style={styles.iconWrapper}>
              <Trophy size={16} color={colors.live} />
            </View>

            <View style={styles.nameWrapper}>
              <LText semiBold style={styles.nameText}>
                {index + 1}. {sr.name}
              </LText>

              <LText style={styles.subText}>
                {BigNumber(sr.voteCount).toFormat()} ({sr.brokerage}%)
              </LText>
            </View>

            <View style={styles.yieldWrapper}>
              <LText semiBold style={styles.yieldText}>
                {"6,8"} %
              </LText>

              <LText style={styles.subText}>Est. yield</LText>
            </View>

            <View>
              <CheckBox isChecked={!!selected[sr.address]} />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

export default translate()(SelectValidatorMain);

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 16,
    height: 32,
    justifyContent: "center",
    backgroundColor: colors.lightGrey,
  },
  headerText: {
    color: colors.smoke,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconWrapper: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colors.lightLive,
    marginRight: 12,
  },
  nameWrapper: {
    flex: 1,
  },
  nameText: {
    fontSize: 15,
  },
  subText: {
    fontSize: 13,
    color: colors.grey,
  },
  yieldWrapper: {
    alignItems: "center",
    marginRight: 12,
  },
  yieldText: {
    fontSize: 17,
  },
});
