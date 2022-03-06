// @flow
import React, { useState, useCallback, useMemo, memo } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  listTokens,
  isCurrencySupported,
} from "@ledgerhq/live-common/lib/currencies";
import { distribute, Action, State } from "@ledgerhq/live-common/lib/apps";
import { App } from "@ledgerhq/live-common/lib/types/manager";
import { useAppsSections } from "@ledgerhq/live-common/lib/apps/react";

import { Text, Box, Flex, Button } from "@ledgerhq/native-ui";

import { Trans } from "react-i18next";
import { useTheme } from "styled-components/native";
import { ManagerTab } from "./Manager";

import AppFilter from "./AppsList/AppFilter";
import UninstallAllButton from "./AppsList/UninstallAllButton";
import UpdateAllButton from "./AppsList/UpdateAllButton";

import Touchable from "../../components/Touchable";
import { track } from "../../analytics";

import DeviceCard from "./Device";
import FirmwareManager from "./Firmware";
import AppRow from "./AppsList/AppRow";

import Searchbar from "./AppsList/Searchbar";

import InstalledAppModal from "./Modals/InstalledAppModal";

import NoAppsInstalled from "../../icons/NoAppsInstalled";
import NoResultsFound from "../../icons/NoResultsFound";
import AppIcon from "./AppsList/AppIcon";

type Props = {
  state: State;
  dispatch: (action: Action) => void;
  setAppInstallWithDependencies: (params: {
    app: App;
    dependencies: App[];
  }) => void;
  setAppUninstallWithDependencies: (params: {
    dependents: App[];
    app: App;
  }) => void;
  setStorageWarning: () => void;
  deviceId: string;
  initialDeviceName: string;
  navigation: any;
  blockNavigation: boolean;
  deviceInfo: any;
  searchQuery?: string;
  updateModalOpened?: boolean;
  tab: ManagerTab;
  optimisticState: State;
};

const AppsScreen = ({
  state,
  dispatch,
  setAppInstallWithDependencies,
  setAppUninstallWithDependencies,
  setStorageWarning,
  deviceId,
  initialDeviceName,
  navigation,
  blockNavigation,
  deviceInfo,
  searchQuery,
  optimisticState,
}: Props) => {
  const distribution = distribute(state);
  const { colors } = useTheme();

  const [appFilter, setFilter] = useState("all");
  const [sort, setSort] = useState("marketcap");
  const [order, setOrder] = useState("desc");

  const onUninstallAll = useCallback(() => dispatch({ type: "wipe" }), [
    dispatch,
  ]);

  const onUpdateAll = useCallback(() => dispatch({ type: "updateAll" }), [
    dispatch,
  ]);

  const sortOptions = useMemo(
    () => ({
      type: sort,
      order,
    }),
    [sort, order],
  );

  const [query, setQuery] = useState(searchQuery || "");

  const { update, device, catalog } = useAppsSections(state, {
    query,
    appFilter,
    sort: sortOptions,
  });

  const tokens = listTokens();

  const { installed, apps } = state;

  const found = useMemo(
    () =>
      tokens.find(
        token =>
          isCurrencySupported(token.parentCurrency) &&
          (token.name.toLowerCase().includes(query.toLowerCase()) ||
            token.ticker.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, tokens],
  );

  const parentInstalled = useMemo(
    () =>
      found &&
      found.parentCurrency &&
      installed.find(
        ({ name }) =>
          name.toLowerCase() === found.parentCurrency.name.toLowerCase(),
      ),
    [found, installed],
  );

  const parent = useMemo(
    () =>
      found &&
      found.parentCurrency &&
      apps.find(
        ({ name }) =>
          name.toLowerCase() === found.parentCurrency.name.toLowerCase(),
      ),
    [found, apps],
  );

  const addAccount = useCallback(() => {
    navigation.navigate(NavigatorName.AddAccounts);
  }, [navigation]);

  const renderNoResults = useCallback(
    () =>
      found && parent ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          style={styles.noAppInstalledContainer}
        >
          <Flex position="relative">
            <AppIcon app={parent} size={48} radius={100} />
            <Flex
              position="absolute"
              bottom={-2}
              right={-2}
              borderWidth={2}
              borderRadius={100}
              borderColor="background.main"
            >
              <AppIcon app={parent} size={18} radius={100} />
            </Flex>
          </Flex>
          <Text
            color="neutral.c100"
            fontWeight="medium"
            variant="h2"
            style={styles.noAppInstalledText}
          >
            <Trans
              i18nKey="v3.manager.token.title"
              values={{
                appName: parent.name,
              }}
            />
          </Text>
          <View>
            <Text
              color="neutral.c80"
              fontWeight="medium"
              variant="body"
              style={styles.noAppInstalledDescription}
            >
              {parentInstalled ? (
                <Trans
                  i18nKey="v3.manager.token.noAppNeeded"
                  values={{
                    appName: parent.name,
                    tokenName: found.name,
                  }}
                />
              ) : (
                <Trans
                  i18nKey="v3.manager.token.installApp"
                  values={{
                    appName: parent.name,
                    tokenName: found.name,
                  }}
                />
              )}
            </Text>
          </View>
        </Flex>
      ) : (
        <Flex
          alignItems="center"
          justifyContent="center"
          style={styles.noAppInstalledContainer}
        >
          <NoResultsFound />
          <Text
            color="neutral.c100"
            fontWeight="medium"
            variant="h2"
            style={styles.noAppInstalledText}
          >
            <Trans i18nKey="manager.appList.noResultsFound" />
          </Text>
          <View>
            <Text
              color="neutral.c80"
              fontWeight="medium"
              variant="body"
              style={styles.noAppInstalledDescription}
            >
              <Trans i18nKey="manager.appList.noResultsDesc" />
            </Text>
          </View>
        </Flex>
      ),
    [found, parent, parentInstalled],
  );

  const renderRow = useCallback(
    ({ item }: { item: any }) => (
      <AppRow
        app={item}
        state={state}
        dispatch={dispatch}
        setAppInstallWithDependencies={setAppInstallWithDependencies}
        setAppUninstallWithDependencies={setAppUninstallWithDependencies}
        setStorageWarning={setStorageWarning}
        optimisticState={optimisticState}
      />
    ),
    [
      state,
      dispatch,
      setAppInstallWithDependencies,
      setAppUninstallWithDependencies,
      setStorageWarning,
      optimisticState,
    ],
  );

  return (
    <Flex flex={1} bg="background.main" px={6}>
      <FlatList
        data={catalog}
        ListHeaderComponent={
          <>
            <View style={styles.title}>
              <Text
                variant={"h1"}
                fontWeight={"medium"}
                color={"neutral.c100"}
                numberOfLines={1}
              >
                <Trans i18nKey="ManagerDevice.title" />
              </Text>
            </View>
            <DeviceCard
              distribution={distribution}
              state={state}
              deviceId={deviceId}
              initialDeviceName={initialDeviceName}
              blockNavigation={blockNavigation}
              deviceInfo={deviceInfo}
            />
            <Box marginBottom={38}>
              <FirmwareManager state={state} deviceInfo={deviceInfo} />
            </Box>
            <Box backgroundColor="background.main">
              <View style={styles.searchBarContainer}>
                <Searchbar searchQuery={query} onQueryUpdate={setQuery} />
                <View style={styles.filterButton}>
                  <AppFilter
                    filter={appFilter}
                    setFilter={setFilter}
                    sort={sort}
                    setSort={setSort}
                    order={order}
                    setOrder={setOrder}
                  />
                </View>
              </View>
            </Box>
          </>
        }
        renderItem={renderRow}
        ListEmptyComponent={renderNoResults}
        keyExtractor={item => item.name}
      />
      <InstalledAppModal
        disable={update && update.length > 0}
        state={state}
        navigation={navigation}
      />
    </Flex>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: "column",
  },
  title: {
    marginTop: 8,
    marginBottom: 32,
  },
  searchBarContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 16,
  },
  appsInstalledAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  filterButton: {
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  indicatorStyle: {
    height: 3,
  },
  tabBarStyle: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    elevation: 0,
  },
  tabStyle: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  labelStyle: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    margin: 0,
    paddingHorizontal: 0,
  },
  labelStyleText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
  },
  updateBadge: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainerStyle: {
    backgroundColor: "transparent",
  },
  noAppInstalledContainer: {
    paddingBottom: 50,
    paddingTop: 30,
  },
  noAppInstalledText: {
    marginTop: 24,
    textAlign: "center",
  },
  noAppInstalledDescription: {
    paddingVertical: 16,
    textAlign: "center",
  },
  addAccountsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  infoButton: {
    marginRight: 8,
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo<Props>(AppsScreen);
