import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { useAppUninstallNeedsDeps } from "@ledgerhq/live-common/lib/apps/react";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { Action, State } from "@ledgerhq/live-common/lib/apps";

import { useTheme } from "@react-navigation/native";

import { Icons, Box } from "@ledgerhq/native-ui";

type Props = {
  app: App,
  state: State,
  dispatch: (action: Action) => void,
  setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
};

const AppUninstallButton = ({
  app,
  state,
  dispatch,
  setAppUninstallWithDependencies,
}: Props) => {
  const { colors } = useTheme();
  const { name } = app;

  const needsDependencies = useAppUninstallNeedsDeps(state, app);

  const uninstallApp = useCallback(() => {
    if (needsDependencies && setAppUninstallWithDependencies)
      setAppUninstallWithDependencies(needsDependencies);
    else dispatch({ type: "uninstall", name });
  }, [needsDependencies, setAppUninstallWithDependencies, dispatch, name]);

  return (
    <TouchableOpacity onPress={uninstallApp}>
      <Box style={[styles.removeAppButton]} borderColor="error.c100">
          <Icons.TrashMedium size={18} color="error.c100"/>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  removeAppButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppUninstallButton;
