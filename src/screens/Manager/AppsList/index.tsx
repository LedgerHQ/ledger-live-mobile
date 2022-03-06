import React, { useCallback, memo } from "react";
import { FlatList } from "react-native";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { State } from "@ledgerhq/live-common/lib/apps";
import styled from "styled-components/native";
import { Flex } from "@ledgerhq/native-ui";
import AppRow from "./AppRow";
import getWindowDimensions from "../../../logic/getWindowDimensions";

type Props = {
  apps: Array<App>,
  isInstalledView: boolean,
  active: boolean,
  state: State,
  dispatch: any,
  renderNoResults?: (param: any) => Node,
  setAppInstallWithDependencies: (params: { app: App, dependencies: App[] }) => void,
  setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
  setStorageWarning: () => void,
  optimisticState: State,
};

const NoResultsContainer = styled(Flex).attrs({
  flex: 1,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
})``;


const AppsList = ({
  apps,
  renderNoResults,
  state,
  dispatch,
  setAppInstallWithDependencies,
  setAppUninstallWithDependencies,
  setStorageWarning,
  isInstalledView,
  optimisticState,
}: Props) => {

  console.log(apps[0].name)

  const renderRow = useCallback(({ item }: { item: any }) => 
    <AppRow app={item}
    state={state}
    dispatch={dispatch}
    setAppInstallWithDependencies={setAppInstallWithDependencies}
    setAppUninstallWithDependencies={setAppUninstallWithDependencies}
    setStorageWarning={setStorageWarning}
    optimisticState={optimisticState}
    />,
  [
    state,
    dispatch,
    setAppInstallWithDependencies,
    setAppUninstallWithDependencies,
    setStorageWarning,
    optimisticState,
  ]);

  const getItem = useCallback(
    (data, index) => ({
      app: data[index],
      index,
      state,
      dispatch,
      key: `${data[index].id}_Catalog`,
      setAppInstallWithDependencies,
      setAppUninstallWithDependencies,
      setStorageWarning,
      optimisticState,
    }),
    [
      state,
      dispatch,
      setAppInstallWithDependencies,
      setAppUninstallWithDependencies,
      setStorageWarning,
      optimisticState,
    ],
  );

  if (!apps || apps.length <= 0)
    return (
      <NoResultsContainer>
        {renderNoResults && renderNoResults()}
      </NoResultsContainer>
    );

  return (
    <FlatList
      listKey={isInstalledView ? "Installed" : "Catalog"}
      data={apps}
      renderItem={renderRow}
    />
  );
};

AppsList.defaultProps = {
  animation: true,
  renderNoResults: () => null,
};

export default memo(AppsList);
