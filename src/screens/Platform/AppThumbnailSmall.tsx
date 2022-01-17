import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { Box, Text } from "@ledgerhq/native-ui";
import styled from "styled-components/native";
import { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import AppIcon from "./AppIcon";

const IMAGE_WIDTH = 60;

const Container = styled(Box).attrs({
  flexDirection: "column",
  alignItems: "center",
})`
  width: ${IMAGE_WIDTH}px;
`.withComponent(TouchableOpacity);

const AppNameText = styled(Text).attrs({
  variant: "body",
  fontWeight: "semiBold",
  fontSize: "14px",
  lineHeight: 16.94,
  textAlign: "center",
  flexShrink: 1,
  numberOfLines: 1,
  ellipsizeMode: "tail",
  marginTop: "8px",
})``;

type Props = {
  appManifest?: AppManifest;
  onPress: (appManifest: AppManifest) => void;
};

const AppThumbnailSmall = ({ appManifest, onPress }: Props) => {
  const handlePress = useCallback(() => {
    if (appManifest && onPress) onPress(appManifest);
  }, [appManifest, onPress]);
  if (!appManifest) {
    return <Container />;
  }

  return (
    <Container onPress={handlePress}>
      <AppIcon
        name={appManifest.name}
        icon={appManifest.icon}
        size={IMAGE_WIDTH}
      />
      <AppNameText>{appManifest.name}</AppNameText>
    </Container>
  );
};

export default AppThumbnailSmall;
