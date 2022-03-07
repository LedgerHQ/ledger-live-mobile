import React, { memo, useCallback, useMemo } from "react";

import { Text, Flex, Button } from "@ledgerhq/native-ui";
import { useAppsSections } from "@ledgerhq/live-common/lib/apps/react";
import { FlatList } from "react-native";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action } from "@ledgerhq/live-common/lib/apps";
import { Trans } from "react-i18next";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";
import AppIcon from "../AppsList/AppIcon";
import ByteSize from "../../../components/ByteSize";
import AppUninstallButton from "../AppsList/AppUninstallButton";
import AppProgressButton from "../AppsList/AppProgressButton";
import { useApps } from "../shared";

type HeaderProps = {
    illustration: any,
};

const Header = ({ illustration }: HeaderProps) => (
    <Flex alignItems="center">
        { illustration }
        <Text variant="h2" fontWeight="medium" color="neutral.c100" my={6}>
            <Trans i18nKey={"v3.manager.myApps"} />
        </Text>
    </Flex>
);

type UninstallButtonProps = {
    app: App,
    state: State,
    dispatch: (action: Action) => void,
    setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
};

const UninstallButton = ({
    app,
    state,
    dispatch,
    setAppUninstallWithDependencies,
}: UninstallButtonProps) => {
    const { uninstallQueue } = state;
    const uninstalling = useMemo(() => uninstallQueue.includes(app.name), [
        uninstallQueue,
        app.name,
    ]);
    const renderAppState = () => {
        switch (true) {
          case uninstalling:
            return <AppProgressButton state={state} name={app.name} size={34} />;
          default:
            return (
              <AppUninstallButton
                app={app}
                state={state}
                dispatch={dispatch}
                setAppUninstallWithDependencies={setAppUninstallWithDependencies}
                size={34}
              />
            );
        }
      };
    
    return (
        <Flex>
            {renderAppState()}
        </Flex>
    );
}

type RowProps = {
    app: App,
    state: State,
    dispatch: (action: Action) => void,
    setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
    deviceInfo: any,
};

const Row = ({
    app,
    state,
    dispatch,
    setAppUninstallWithDependencies,
    deviceInfo,
}: RowProps) => (
        <Flex flexDirection="row" py={4} alignItems="center" justifyContent="space-between">
            <Flex flexDirection="row" alignItems="center">
                <AppIcon app={app} size={24} radius={8} />
                <Text variant="large" fontWeight="semiBold" color="neutral.c100" ml={4}>{app.name}</Text>
            </Flex>
            <Flex flexDirection="row" alignItems="center">
                <Text
                    variant="small"
                    fontWeight="medium"
                    color="neutral.c80"
                    mx={4}
                >
                    <ByteSize
                        value={app.bytes}
                        deviceModel={state.deviceModel}
                        firmwareVersion={deviceInfo.version}
                    />
                </Text>
                <UninstallButton
                    app={app}
                    state={state}
                    dispatch={dispatch}
                    setAppUninstallWithDependencies={setAppUninstallWithDependencies}
                />
            </Flex>
        </Flex>
);

type RouteParams = {
    result: ListAppsResult,
    illustration: any,
    deviceInfo: any,
    deviceId: string,
    setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
};  

type Props = {
    route: { params: RouteParams },
};

const MyApps = ({
  route,
}: Props) => {
    const { result, illustration, deviceInfo, deviceId, setAppUninstallWithDependencies } = route.params;
    const [state, dispatch] = useApps(result, deviceId);
    const { device } = useAppsSections(state, {
        query: "",
        appFilter: "all",
        sort: {
            type: "marketcap",
            order: "desc",
        },
    });

    const onUninstallAll = useCallback(() => dispatch({ type: "wipe" }), [
        dispatch,
    ]);  

    const renderItem = useCallback(
        ({ item }: { item: App }) => (
            <Row
                app={item}
                state={state}
                dispatch={dispatch}
                setAppUninstallWithDependencies={setAppUninstallWithDependencies}
                deviceInfo={deviceInfo}
            />
        ),
        [deviceInfo, dispatch, setAppUninstallWithDependencies, state],
    );
    
    return (
        <Flex flex={1}>
            <Flex flex={1}>
                <FlatList
                    data={device}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={<Header illustration={illustration} />}
                    style={{ paddingHorizontal: 16 }}
                />
            </Flex>
            <Flex m={6}>
                <Button size="large" type="error" onPress={onUninstallAll}>
                    <Trans i18nKey={"v3.manager.uninstall.uninstallAll"} />
                </Button>
            </Flex>
        </Flex>
    );
};

export default memo(MyApps);
