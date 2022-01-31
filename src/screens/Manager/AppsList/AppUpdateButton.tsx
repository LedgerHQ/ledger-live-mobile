import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { Action, State } from "@ledgerhq/live-common/lib/apps";

import { Icons, Box } from "@ledgerhq/native-ui";

type Props = {
  app: App,
  state: State,
  dispatch: (action: Action) => void,
};

export default function AppUpdateButton({
  app,
  state,
  dispatch: dispatchProps,
}: Props) {
  const { name } = app;
  const { installed, updateAllQueue } = state;

  const canUpdate = useMemo(
    () => installed.some(({ name, updated }) => name === app.name && !updated),
    [installed, app.name],
  );

  const updateApp = useCallback(() => {
    if (!canUpdate) return;
    dispatchProps({ type: "update", name });
  }, [
    canUpdate,
    dispatchProps,
    name,
  ]);

  return (
    <TouchableOpacity onPress={updateApp}>
      <Box style={[styles.addAppButton]} backgroundColor="primary.c80">
        <Icons.RefreshMedium size={18} color="neutral.c00"/>
      </Box>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appStateText: {
    fontSize: 12,
  },
  addAppButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
