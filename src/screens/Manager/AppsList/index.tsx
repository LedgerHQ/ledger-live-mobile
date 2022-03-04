import React, { useCallback, memo } from "react";
import { VirtualizedList } from "react-native";
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

const { height } = getWindowDimensions();

const renderRow = ({ item }: { item: any }) => <AppRow {...item} />;

const AppsList = ({
  apps,
  active,
  renderNoResults,
  state,
  dispatch,
  setAppInstallWithDependencies,
  setAppUninstallWithDependencies,
  setStorageWarning,
  isInstalledView,
  optimisticState,
}: Props) => {
  const viewHeight = active ? "auto" : height - 267;

  const getItem = useCallback(
    (data, index) => ({
      app: data[index],
      index,
      state,
      dispatch,
      key: `${data[index].id}_${isInstalledView ? "Installed" : "Catalog"}`,
      visible: active,
      isInstalledView,
      setAppInstallWithDependencies,
      setAppUninstallWithDependencies,
      setStorageWarning,
      optimisticState,
    }),
    [
      state,
      dispatch,
      isInstalledView,
      active,
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
    <VirtualizedList
      style={{ height: viewHeight || 0 }}
      listKey={isInstalledView ? "Installed" : "Catalog"}
      data={apps}
      renderItem={renderRow}
      getItem={getItem}
      getItemCount={() => apps.length}
    />
  );
};

AppsList.defaultProps = {
  animation: true,
  renderNoResults: () => null,
};

export default memo(AppsList);
