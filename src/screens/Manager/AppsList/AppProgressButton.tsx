import React from "react";
import { StyleSheet } from "react-native";

import type { State } from "@ledgerhq/live-common/lib/apps";
import { useTheme } from "styled-components/native";

import { Box, ProgressLoader } from "@ledgerhq/native-ui";

import { useAppInstallProgress } from "@ledgerhq/live-common/lib/apps/react";

type Props = {
  state: State,
  name: string,
  installing: boolean,
  updating: boolean,
};
export default function AppUpdateButton({
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
      <Box style={styles.buttonCenter} backgroundColor={color} />
    </ProgressLoader>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonCenter: {
    width: 10,
    height: 10,
    borderRadius: 1,
  },
});
