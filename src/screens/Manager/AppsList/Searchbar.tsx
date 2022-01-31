import React, { useState, useMemo, useCallback, useRef } from "react";
import { View, StyleSheet, Platform, VirtualizedList, TouchableOpacity, TextInput } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import type { Action, State } from "@ledgerhq/live-common/lib/apps";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import { useSortedFilteredApps } from "@ledgerhq/live-common/lib/apps/filtering";
import {
  listTokens,
  isCurrencySupported,
} from "@ledgerhq/live-common/lib/currencies";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "styled-components/native";
import { installAppFirstTime } from "../../../actions/settings";
import { hasInstalledAnyAppSelector } from "../../../reducers/settings";

import Button from "../../../components/Button";
import SearchIcon from "../../../icons/Search";
import NoResults from "../../../icons/NoResults";
import { NavigatorName } from "../../../const";
// import TextInput from "../../../components/TextInput";
import LText from "../../../components/LText";
import Touchable from "../../../components/Touchable";
import NavigationScrollView from "../../../components/NavigationScrollView";
import Styles from "../../../navigation/styles";
import AppRow from "../AppsList/AppRow";
import getWindowDimensions from "../../../logic/getWindowDimensions";
import AppIcon from "../AppsList/AppIcon";

import { Text, Flex, Icons } from "@ledgerhq/native-ui";

const { height } = getWindowDimensions();

type Props = {
  state: State,
  dispatch: (action: Action) => void,
  isInstalledView: boolean,
  apps?: App[],
  disabled: boolean,
  setAppInstallWithDependencies: (params: { app: App, dependencies: App[] }) => void,
  setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
  navigation: any,
  searchQuery?: string,
  optimisticState: State,
};

export default ({
  state,
  dispatch,
  isInstalledView,
  apps,
  disabled,
  setAppInstallWithDependencies,
  setAppUninstallWithDependencies,
  navigation,
  searchQuery,
  optimisticState,
}: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const textInput = useRef();
  const listRef = useRef();
  const reduxDispatch = useDispatch();
  const hasInstalledAnyApp = useSelector(hasInstalledAnyAppSelector);
  const [isOpened, setIsOpen] = useState(!!searchQuery);
  const [depInstall, setDepsInstall] = useState();
  const [depUninstall, setDepsUninstall] = useState();
  const [query, setQuery] = useState(searchQuery || null);

  const closeSearchModal = useCallback(deps => {
    setIsOpen(false);
    if (deps) {
      if (deps.dependencies) setDepsInstall(deps);
      else if (deps.dependents) setDepsUninstall(deps);
    }
  }, []);

  const clear = useCallback(() => setQuery(""), [setQuery]);

  const filterOptions: FilterOptions = useMemo(
    () => ({
      query,
      installedApps: [],
      type: [],
    }),
    [query],
  );

  const sortedApps: Array<App> = useSortedFilteredApps(
    apps || state.apps,
    filterOptions,
    { type: "marketcap", order: "desc" },
  );

  const placeholder = useMemo(
    () =>
      !isInstalledView
        ? t("manager.appList.searchAppsCatalog")
        : t("manager.appList.searchAppsInstalled"),
    [isInstalledView, t],
  );

  /*
  <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <View style={styles.searchBarIcon}>
            <SearchIcon size={16} color={colors.smoke} />
          </View>
              <TextInput
                ref={textInput}
                returnKeyType="search"
                maxLength={50}
                onChangeText={setQuery}
                clearButtonMode="always"
                style={[
                  styles.searchBarText,
                  styles.searchBarInput,
                  { color: colors.smoke },
                ]}
                placeholder={placeholder}
                placeholderTextColor={colors.smoke}
                onInputCleared={clear}
                value={query}
                numberOfLines={1}
              />
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeSearchModal}
            >
              <LText style={styles.cancelButtonText} color="smoke">
                <Trans i18nKey="common.cancel" />
              </LText>
            </TouchableOpacity>
          </View>
  */

  return (
    <Flex style={styles.container} borderColor="neutral.c40">
        <Icons.SearchMedium size={17} color="neutral.c70" />
        <TextInput
            ref={textInput}
            returnKeyType="search"
            maxLength={50}
            onChangeText={setQuery}
            clearButtonMode="always"
            placeholder={t("v3.manager.appList.searchApps")}
            placeholderTextColor={colors.neutral.c70}
            onInputCleared={clear}
            value={query}
            numberOfLines={1}
            style={{ ...styles.input, color: colors.neutral.c100 }}
            keyboardType={Platform.OS === "android" ? "visible-password" : "default"}
        />
        {query && query.length > 0 ? (
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
