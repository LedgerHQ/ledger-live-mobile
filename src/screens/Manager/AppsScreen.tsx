// @flow
import React, { useState, useCallback, useMemo, useRef, memo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { distribute } from "@ledgerhq/live-common/lib/apps";
import type { Action, State } from "@ledgerhq/live-common/lib/apps";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import { useAppsSections } from "@ledgerhq/live-common/lib/apps/react";

import { Text, Box, Flex, Icons } from "@ledgerhq/native-ui";

import { TabView, TabBar } from "react-native-tab-view";
import Animated from "react-native-reanimated";

import i18next from "i18next";
import { Trans } from "react-i18next";
import type { ManagerTab } from "./Manager";

import SearchModal from "./Modals/SearchModal";
import AppFilter from "./AppsList/AppFilter";
import UninstallAllButton from "./AppsList/UninstallAllButton";
import UpdateAllButton from "./AppsList/UpdateAllButton";

import LText from "../../components/LText";
import Touchable from "../../components/Touchable";
import { track } from "../../analytics";

import DeviceCard from "./Device";
import FirmwareManager from "./Firmware";
import AppsList from "./AppsList";
import AppUpdateAll from "./AppsList/AppUpdateAll";

import Searchbar from "./AppsList/Searchbar";

import InstallProgressBar from "./AppsList/InstallProgressBar";
import { useTheme } from "styled-components/native";

import NoAppsInstalled from "../../icons/NoAppsInstalled";
import NoResultsFound from "../../icons/NoResultsFound";

const { interpolateNode, Extrapolate } = Animated;
const { width, height } = Dimensions.get("screen");
const initialLayout = { width, height };

type Props = {
  state: State,
  dispatch: (action: Action) => void,
  setAppInstallWithDependencies: (params: { app: App, dependencies: App[] }) => void,
  setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
  setStorageWarning: () => void,
  managerTabs: { [ManagerTab]: ManagerTab },
  deviceId: string,
  initialDeviceName: string,
  navigation: any
  blockNavigation: boolean,
  deviceInfo: any,
  searchQuery?: string,
  updateModalOpened?: boolean,
  tab: ManagerTab,
  optimisticState: State,
};

const AppsScreen = ({
  state,
  dispatch,
  setAppInstallWithDependencies,
  setAppUninstallWithDependencies,
  setStorageWarning,
  managerTabs,
  deviceId,
  initialDeviceName,
  navigation,
  blockNavigation,
  deviceInfo,
  searchQuery,
  updateModalOpened,
  tab,
  optimisticState,
}: Props) => {
  const distribution = distribute(state);
  const listRef = useRef();
  const { colors } = useTheme();

  const [index, setIndex] = useState(tab === managerTabs.CATALOG ? 0 : 1);
  const [routes] = React.useState([
    {
      key: managerTabs.CATALOG,
      title: i18next.t("manager.appsCatalog"),
    },
    {
      key: managerTabs.INSTALLED_APPS,
      title: i18next.t("v3.manager.installedApps"),
      notif: null,
    },
  ]);

  const [appFilter, setFilter] = useState("all");
  const [sort, setSort] = useState("marketcap");
  const [order, setOrder] = useState("desc");

  const [position] = useState(() => new Animated.Value(0));

  const searchOpacity = interpolateNode(position, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const [scrollY, setScrollY] = useState(0);

  const onScroll = useCallback(
    evt => setScrollY(evt.nativeEvent.contentOffset.y),
    [setScrollY],
  );

  const scrollToTop = useCallback(() => {
    if (scrollY > 280)
      setTimeout(() => {
        if (listRef.current && listRef.current.scrollToIndex)
          listRef.current.scrollToIndex({ index: 1 });
      }, 100);
  }, [scrollY]);

  const jumpTo = useCallback(
    key => {
      track("ManagerTabBarClick", { tab: key });
      setIndex(key === managerTabs.CATALOG ? 0 : 1);
      scrollToTop();
    },
    [managerTabs.CATALOG, scrollToTop],
  );

  const onIndexChange = useCallback(
    index => {
      track("ManagerTabSwipe", {
        tab: index === 0 ? managerTabs.CATALOG : managerTabs.INSTALLED_APPS,
      });
      setIndex(index);
      scrollToTop();
    },
    [managerTabs.CATALOG, managerTabs.INSTALLED_APPS, scrollToTop],
  );

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

  const { update, device, catalog } = useAppsSections(state, {
    query: "",
    appFilter,
    sort: sortOptions,
  });

  const renderNoResults = useCallback(
    () => (
      <Flex alignItems="center" justifyContent="center" style={styles.noAppInstalledContainer}>
        <NoResultsFound />
        <Text color="neutral.c100" fontWeight="medium" variant="h2" style={styles.noAppInstalledText}>
          <Trans i18nKey="manager.appList.noResultsFound" />
        </Text>
        <View>
          <Text color="neutral.c80" fontWeight="medium" variant="body" style={styles.noAppInstalledDescription}>
            <Trans i18nKey="manager.appList.noResultsDesc" />
          </Text>
        </View>
      </Flex>
    ),
    [setIndex],
  );
  
  const renderNoInstalledApps = useCallback(
    () => (
      <Flex alignItems="center" justifyContent="center" style={styles.noAppInstalledContainer}>
        <NoAppsInstalled />
        <Text color="neutral.c100" fontWeight="medium" variant="h2" style={styles.noAppInstalledText}>
          <Trans i18nKey="manager.appList.noAppsInstalled" />
        </Text>
        <Touchable
          onPress={() => setIndex(0)}
          activeOpacity={0.5}
          event="ManagerNoAppsInstalledClick"
        >
          <Text color="neutral.c80" fontWeight="medium" variant="body" style={styles.noAppInstalledDescription}>
            <Trans i18nKey="manager.appList.noAppsDescription" />
          </Text>
        </Touchable>
      </Flex>
    ),
    [setIndex],
  );

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case managerTabs.CATALOG:
        return (
          <AppsList
            apps={catalog}
            state={state}
            dispatch={dispatch}
            active={index === 0}
            renderNoResults={renderNoResults}
            setAppInstallWithDependencies={setAppInstallWithDependencies}
            setAppUninstallWithDependencies={setAppUninstallWithDependencies}
            setStorageWarning={setStorageWarning}
            optimisticState={optimisticState}
          />
        );
      case managerTabs.INSTALLED_APPS:
        return (
          <>
            <Flex style={{ marginBottom: 24 }}>
              <Flex>
                <AppUpdateAll
                  state={state}
                  appsToUpdate={update}
                  dispatch={dispatch}
                  isModalOpened={updateModalOpened}
                />
              </Flex>
              {device && device.length > 0 && !state.updateAllQueue.length && (
                <Flex style={[styles.appsInstalledAction]} borderColor="neutral.c40">
                  <Text variant="body" fontWeight="semiBold" color="neutral.c100">
                    <Trans
                      count={device.length}
                      values={{ number: device.length }}
                      i18nKey="v3.manager.storage.appsToUpdate"
                    />
                  </Text>
                  <UpdateAllButton
                    state={state}
                    onUpdateAll={onUpdateAll}
                    apps={device}
                  />
                </Flex>
              )}
              {device && device.length > 0 && !state.updateAllQueue.length && (
                <Flex style={[styles.appsInstalledAction]} borderColor="neutral.c40">
                  <Text variant="body" fontWeight="semiBold" color="neutral.c100">
                    <Trans
                      count={device.length}
                      values={{ number: device.length }}
                      i18nKey="v3.manager.storage.appsInstalled"
                    />
                  </Text>
                  <UninstallAllButton onUninstallAll={onUninstallAll} />
                </Flex>
              )}
            </Flex>
            <AppsList
              isInstalledView
              apps={device}
              state={state}
              dispatch={dispatch}
              active={index === 1}
              renderNoResults={renderNoInstalledApps}
              setAppInstallWithDependencies={setAppInstallWithDependencies}
              setAppUninstallWithDependencies={setAppUninstallWithDependencies}
              setStorageWarning={setStorageWarning}
              optimisticState={optimisticState}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderLabel = useCallback(
    ({
      route,
      color,
    }: {
      route: { title: string, key: string },
      color: string,
    }) => (
      <View style={styles.labelStyle}>
        <LText
          bold
          style={{
            ...styles.labelStyleText,
            color,
          }}
        >
          {route.title}
        </LText>
        {route.key === managerTabs.INSTALLED_APPS && update.length > 0 && (
          <Flex style={[styles.updateBadge, { backgroundColor: colors.primary.c70 }]}>
            <Text variant="small" fontWeight="bold" color="neutral.c100">
              {update.length}
            </Text>
          </Flex>
        )}
      </View>
    ),
    [update, managerTabs, colors.primary.c70],
  );

  /*
    <Animated.View
          style={[
            styles.searchBarContainer,
            {
              opacity: searchOpacity,
              zIndex: index === 0 ? 2 : -1,
              borderColor: colors.lightFog,
            },
          ]}
        >
          <SearchModal
            state={state}
            dispatch={dispatch}
            disabled={index !== 0}
            setAppInstallWithDependencies={setAppInstallWithDependencies}
            setAppUninstallWithDependencies={setAppUninstallWithDependencies}
            navigation={navigation}
            searchQuery={searchQuery}
            optimisticState={optimisticState}
          />
          <View style={[styles.filterButton]}>
            <AppFilter
              filter={appFilter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
              order={order}
              setOrder={setOrder}
              disabled={index !== 0}
            />
          </View>
        </Animated.View>
    */

  const elements = [
    <View style={styles.title}>
      <Text variant={'h1'} fontWeight={'medium'} color={'neutral.c100'} numberOfLines={1}>
        <Trans i18nKey="ManagerDevice.title" />
      </Text>
    </View>,
    <DeviceCard
      distribution={distribution}
      state={state}
      deviceId={deviceId}
      initialDeviceName={initialDeviceName}
      blockNavigation={blockNavigation}
      deviceInfo={deviceInfo}
    />,
    <Box marginBottom={38}>
      <FirmwareManager
        state={state}
        deviceInfo={deviceInfo}
      />
    </Box>,
    <Box backgroundColor="background.main">
      <TabBar
        position={position}
        navigationState={{ index, routes }}
        jumpTo={jumpTo}
        style={[styles.tabBarStyle, { borderColor: colors.neutral.c40 }]}
        indicatorStyle={[
          styles.indicatorStyle,
          { backgroundColor: colors.primary.c70 },
        ]}
        tabStyle={styles.tabStyle}
        activeColor={colors.neutral.c100}
        inactiveColor={colors.neutral.c80}
        labelStyle={styles.labelStyle}
        contentContainerStyle={styles.contentContainerStyle}
        renderLabel={renderLabel}
      />
      {index === 0 && (
      <View style={styles.searchBarContainer}>
        <Searchbar
          state={state}
          dispatch={dispatch}
          disabled={index !== 0}
          setAppInstallWithDependencies={setAppInstallWithDependencies}
          setAppUninstallWithDependencies={setAppUninstallWithDependencies}
          navigation={navigation}
          searchQuery={searchQuery}
          optimisticState={optimisticState}
        />
        <View style={styles.filterButton}>
          <AppFilter
            filter={appFilter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            order={order}
            setOrder={setOrder}
            disabled={index !== 0}
          />
        </View>
      </View>)}
    </Box>,
    <TabView
      renderTabBar={() => null}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={onIndexChange}
      initialLayout={initialLayout}
      position={position}
      sceneContainerStyle={{}}
    />,
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background.main }]}> 
      <FlatList
        ref={listRef}
        onScroll={onScroll}
        scrollEventThrottle={50}
        data={elements}
        renderItem={({ item }) => item}
        keyExtractor={(_, i) => String(i)}
        stickyHeaderIndices={[3]}
      />
      <InstallProgressBar
        disable={update && update.length > 0}
        state={state}
        navigation={navigation}
      />
    </SafeAreaView>
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
