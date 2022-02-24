import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";

import { useAppUninstallNeedsDeps } from "@ledgerhq/live-common/lib/apps/react";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { Action, State } from "@ledgerhq/live-common/lib/apps";

import styled from "styled-components/native";
import { Icons, Box } from "@ledgerhq/native-ui";

type Props = {
  app: App,
  state: State,
  dispatch: (action: Action) => void,
  setAppUninstallWithDependencies: (params: { dependents: App[], app: App }) => void,
};

const ButtonContainer = styled(Box).attrs({
  width: 48,
  height: 48,
  borderWidth: 1,
  borderRadius: 50,
  alignItems: "center",
  justifyContent: "center",
})``;

const AppUninstallButton = ({
  app,
  state,
  dispatch,
  setAppUninstallWithDependencies,
}: Props) => {
  const { name } = app;

  const needsDependencies = useAppUninstallNeedsDeps(state, app);

  const uninstallApp = useCallback(() => {
    if (needsDependencies && setAppUninstallWithDependencies)
      setAppUninstallWithDependencies(needsDependencies);
    else dispatch({ type: "uninstall", name });
  }, [needsDependencies, setAppUninstallWithDependencies, dispatch, name]);

  return (
    <TouchableOpacity onPress={uninstallApp}>
      <ButtonContainer borderColor="error.c100">
        <Icons.TrashMedium size={18} color="error.c100"/>
      </ButtonContainer>
    </TouchableOpacity>
  );
};

export default AppUninstallButton;
