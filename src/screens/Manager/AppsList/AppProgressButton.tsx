import React from "react";

import type { State } from "@ledgerhq/live-common/lib/apps";
import styled from "styled-components/native";

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
  const progress = useAppInstallProgress(state, name);

  const color = updating ? "primary.c80" : installing ? "neutral.c100" : "error.c100";

  return (
    <ProgressLoader
      onPress={() => {}}
      progress={progress}
      infinite={!installing && !updating}
      radius={24}
      strokeWidth={2}
      mainColor={color}
    >
      <ButtonCenter bg={color} />
    </ProgressLoader>
  );
}
