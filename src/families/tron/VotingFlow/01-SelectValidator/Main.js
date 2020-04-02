// @flow
import { BigNumber } from "bignumber.js";
import React from "react";
import { translate } from "react-i18next";
import type { TFunction } from "react-i18next";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { SectionList } from "react-navigation";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import colors from "../../../../colors";
import CheckBox from "../../../../components/CheckBox";
import LText from "../../../../components/LText";
import TextInput from "../../../../components/TextInput";
import SearchIcon from "../../../../icons/Search";
import Trophy from "../../../../icons/Trophy";
import { getIsVoted } from "./utils";

type Props = {
  transaction: Transaction,
  sections: Section[],
  // eslint-disable-next-line spaced-comment
  /** @TODO export data type from live-common **/
  onPress: (item: any) => void,
  onChangeSearchQuery: (searchQuery: string) => void,
  t: TFunction,
};

export type Section = {
  type: "superRepresentatives" | "candidates",
  // eslint-disable-next-line spaced-comment
  /** @TODO export data type from live-common **/
  data: any[],
};

function SelectValidatorMain({
  transaction,
  sections,
  onPress,
  onChangeSearchQuery,
  t,
}: Props) {
  return (
    <SectionList
      sections={sections}
      keyExtractor={({ address }, i) => address + i}
      ListHeaderComponent={translate()(SelectValidatorMainHeader)}
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
            onPress={() => onPress(item)}
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

type SelectValidatorMainHeaderProps = {
  t: TFunction,
};

function SelectValidatorMainHeader({ t }: SelectValidatorMainHeaderProps) {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.searchBar}>
        <View style={styles.searchBarIcon}>
          <SearchIcon size={16} color={colors.smoke} />
        </View>

        <TextInput
          // ref={textInput}
          returnKeyType="search"
          maxLength={50}
          // onChangeText={setQuery}
          clearButtonMode="always"
          style={[styles.searchBarText, styles.searchBarInput]}
          placeholder={t("common.search")}
          placeholderTextColor={colors.smoke}
          // onInputCleared={clear}
          // onFocus={onFocus}
          // value={query}
          numberOfLines={1}
        />
      </View>
    </View>
  );
}

export default translate()(SelectValidatorMain);

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
