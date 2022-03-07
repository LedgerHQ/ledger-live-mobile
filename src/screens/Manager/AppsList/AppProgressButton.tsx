import React from "react";

import type { State } from "@ledgerhq/live-common/lib/apps";
import styled, { useTheme } from "styled-components/native";

import { Box, ProgressLoader } from "@ledgerhq/native-ui";

import { useAppInstallProgress } from "@ledgerhq/live-common/lib/apps/react";

type Props = {
  state: State,
  name: string,
  installing: boolean,
  updating: boolean,
  size: number,
};

const ButtonCenter = styled(Box).attrs({
  width: 10,
  height: 10,
  borderRadius: "1px",
})``;

export default function AppProgressButton({
  state,
  name,
  installing,
  updating,
  size = 48,
}: Props) {
  const { colors } = useTheme();
  const progress = useAppInstallProgress(state, name);

  const color = updating ? colors.primary.c80 : installing ? colors.neutral.c100 : colors.error.c100;

  return (
    <ProgressLoader
      onPress={() => {}}
      progress={progress}
      infinite={!installing && !updating}
      radius={size / 2}
      strokeWidth={2}
      mainColor={color}
    >
      <ButtonCenter bg={color} />
    </ProgressLoader>
  );
}
