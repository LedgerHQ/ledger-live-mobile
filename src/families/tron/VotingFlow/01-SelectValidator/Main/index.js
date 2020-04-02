// @flow
import { BigNumber } from "bignumber.js";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SectionList } from "react-navigation";
import colors from "../../../../../colors";
import CheckBox from "../../../../../components/CheckBox";
import LText from "../../../../../components/LText";
import Trophy from "../../../../../icons/Trophy";
import { getIsVoted, useSelectValidatorContext } from "../utils";
import SelectValidatorSearchBox from "./SearchBox";

export default function SelectValidatorMain() {
  const {
    onSelectSuperRepresentative,
    sections,
    transaction,
    remainingCount,
    t,
  } = useSelectValidatorContext();

  return (
    <>
      <SelectValidatorSearchBox />
      <SectionList
        sections={sections}
        keyExtractor={({ address }, i) => address + i}
        renderSectionHeader={({ section: { type } }) => (
          <View style={styles.sectionHeaderWrapper}>
            <LText style={styles.sectionHeaderText}>
              {t(`tron.voting.flow.selectValidator.sections.title.${type}`)}
            </LText>
          </View>
        )}
        renderItem={({ item, index }) => {
          const { address, sr } = item;
          const isVoted = getIsVoted(transaction, address);
          const disabled = !isVoted && remainingCount <= 0;

          return (
            <TouchableOpacity
              onPress={() => onSelectSuperRepresentative(item)}
              disabled={disabled}
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
                <CheckBox isChecked={isVoted} disabled={disabled} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeaderWrapper: {
    paddingHorizontal: 16,
    height: 32,
    justifyContent: "center",
    backgroundColor: colors.lightGrey,
  },
  sectionHeaderText: {
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
