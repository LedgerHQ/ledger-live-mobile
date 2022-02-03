import React, { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";

import { Flex, Icons } from "@ledgerhq/native-ui";

type Props = {
  searchQuery?: string;
  onQueryUpdate: (query: string) => void;
};

export default ({ searchQuery, onQueryUpdate }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const textInput = useRef();

  const clear = useCallback(() => onQueryUpdate(""), [onQueryUpdate]);

  return (
    <Flex style={styles.container} borderColor="neutral.c40">
      <Icons.SearchMedium size={17} color="neutral.c70" />
      <TextInput
        ref={textInput}
        returnKeyType="search"
        maxLength={50}
        onChangeText={onQueryUpdate}
        clearButtonMode="always"
        placeholder={t("v3.manager.appList.searchApps")}
        placeholderTextColor={colors.neutral.c70}
        onInputCleared={clear}
        value={searchQuery}
        numberOfLines={1}
        style={{ ...styles.input, color: colors.neutral.c100 }}
        keyboardType={
          Platform.OS === "android" ? "visible-password" : "default"
        }
      />
      {searchQuery && searchQuery.length > 0 ? (
        <TouchableOpacity onPress={clear}>
          <Icons.CircledCrossSolidMedium size={20} color="neutral.c60" />
        </TouchableOpacity>
      ) : null}
    </Flex>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 17.5,
    borderWidth: 1,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  input: {
    padding: 0,
    paddingLeft: 10,
    flex: 1,
  },
});
