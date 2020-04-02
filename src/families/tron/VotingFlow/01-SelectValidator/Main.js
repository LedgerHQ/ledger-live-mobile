// @flow
import { BigNumber } from "bignumber.js";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { SectionList } from "react-navigation";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import colors from "../../../../colors";
import CheckBox from "../../../../components/CheckBox";
import LText from "../../../../components/LText";
import TextInput from "../../../../components/TextInput";
import SearchIcon from "../../../../icons/Search";
import Trophy from "../../../../icons/Trophy";
import { getIsVoted, useSelectValidatorContext } from "./utils";

export default function SelectValidatorMain() {
  const {
    onSelectSuperRepresentative,
    sections,
    transaction,
    t,
  } = useSelectValidatorContext();

  return (
    <SectionList
      sections={sections}
      keyExtractor={({ address }, i) => address + i}
      ListHeaderComponent={SelectValidatorMainHeader}
      renderSectionHeader={({ section: { type } }) => (
        <View style={styles.sectionHeaderWrapper}>
          <LText style={styles.sectionHeaderText}>
            {t(`tron.voting.flow.selectValidator.sections.title.${type}`)}
          </LText>
        </View>
      )}
      renderItem={({ item, index }) => {
        const { address, sr } = item;

        return (
          <TouchableOpacity
            onPress={() => onSelectSuperRepresentative(item)}
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
              <CheckBox isChecked={getIsVoted(transaction, address)} />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

function SelectValidatorMainHeader() {
  const { searchQuery, setSearchQuery, t } = useSelectValidatorContext();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.searchBar}>
        <View style={styles.searchBarIcon}>
          <SearchIcon size={16} color={colors.smoke} />
        </View>

        <TextInput
          returnKeyType="search"
          maxLength={50}
          onChangeText={setSearchQuery}
          clearButtonMode="always"
          style={[styles.searchBarText, styles.searchBarInput]}
          placeholder={t("common.search")}
          placeholderTextColor={colors.smoke}
          onInputCleared={() => setSearchQuery("")}
          value={searchQuery}
          numberOfLines={1}
        />
      </View>
    </View>
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
  headerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    alignItems: "stretch",
  },
  searchBar: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    height: 44,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.lightGrey,
    borderRadius: 3,
    paddingRight: Platform.OS === "ios" ? 0 : 44,
  },
  searchBarIcon: {
    flexBasis: 44,
    flexGrow: 0,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarInput: {
    flexGrow: 1,
    flexDirection: "row",
    height: 44,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.lightGrey,
    borderRadius: 3,
  },
  searchBarText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 17,
    color: colors.smoke,
  },
});
