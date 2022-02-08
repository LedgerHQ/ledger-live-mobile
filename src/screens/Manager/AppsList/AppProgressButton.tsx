import React from "react";

import type { State } from "@ledgerhq/live-common/lib/apps";
import styled, { useTheme } from "styled-components/native";

// TODO : replace by { Box, ProgressLoader } when ProgressLoader exported from ui
import { Box, Loader as ProgressLoader } from "@ledgerhq/native-ui";

import { useAppInstallProgress } from "@ledgerhq/live-common/lib/apps/react";

type Props = {
  state: State,
  name: string,
  installing: boolean,
  updating: boolean,
};

const ButtonCenter = styled(Box).attrs({
  width: 10,
  height: 10,
  borderRadius: 1,
})``;

export default function AppProgressButton({
  state,
  name,
  installing,
  updating,
}: Props) {
  const { colors } = useTheme();

  const progress = useAppInstallProgress(state, name);

  const color = updating ? colors.primary.c80 : installing ? colors.neutral.c100 : colors.error.c100;

  return (
    <ProgressLoader
      onPress={() => {}}
      progress={progress}
      infinite={!installing && !updating}
      radius={24}
      strokeWidth={2}
      mainColor={color}
    >
      <ButtonCenter backgroundColor={color} />
    </ProgressLoader>
  );
}
