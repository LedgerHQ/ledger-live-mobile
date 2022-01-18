import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import {
  AppManifest,
  AppMetadata,
} from "@ledgerhq/live-common/lib/platform/types";
import { translateContent } from "@ledgerhq/live-common/lib/platform/logic";
import { useTranslation } from "react-i18next";
import { Icons, Flex, Text } from "@ledgerhq/native-ui";
import { useLocale } from "../../context/Locale";
import AppIcon from "./AppIcon";

type Props = {
  manifest: AppManifest;
  appMetadata: AppMetadata;
  onPress: (manifest: AppManifest) => void;
};

const Container = styled(Flex).attrs({
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
})<{ disabled: boolean }>`
  ${p => p.disabled && "opacity: 0.6;"}
`;
const LeftContainer = styled(Flex).attrs({
  flexDirection: "column",
  alignItems: "flex-start",
  paddingRight: "16px",
  flex: 1,
})``;
const RightContainer = styled(Flex).attrs({
  flexDirection: "column",
  justifyContainer: "center",
  alignItems: "center",
})``;
const HeaderContainer = styled(Flex).attrs({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: "12px",
})``;
const NameAndTagContainer = styled(Flex).attrs({
  flexDirection: "column",
  justifyContent: "center",
  paddingLeft: "16px",
  alignItems: "flex-start",
})``;
const DescriptionContainer = styled(Flex).attrs({
  flex: 1,
})``;
const AppNameText = styled(Text).attrs({
  variant: "large",
  fontWeight: "semiBold",
  fontSize: "16px",
  lineHeight: 19,
})``;
// const Tag = styled().attrs({})``;
const DescriptionText = styled(Text).attrs({
  variant: "body",
  fontWeight: "medium",
  color: "neutral.c70",
  fontSize: "14px",
  lineHeight: 20,
})``;

type TagProps = {
  highlight?: boolean;
  disabled?: boolean;
};
/* TODO at some point: reuse native-ui's Tag, it's just not working properly in pre-v3 environment */
const TagContainer = styled(Flex).attrs((p: TagProps) => ({
  paddingHorizontal: 5,
  paddingVertical: 3,
  backgroundColor: p.highlight
    ? "primary.c90"
    : p.disabled
    ? "neutral.c50"
    : "",
  border: "1px solid",
  borderColor: p.highlight
    ? "primary.c90"
    : p.disabled
    ? "neutral.c50"
    : "neutral.c70",
  borderRadius: "4px",
}))<TagProps>``;

/* TODO at some point: reuse native-ui's Tag, it's just not working properly in pre-v3 environment */
const TagText = styled(Text).attrs((p: TagProps) => ({
  variant: "tiny",
  fontWeight: "semiBold",
  fontSize: "10px",
  lineHeight: "12px",
  color: p.highlight || p.disabled ? "neutral.c30" : "neutral.c70",
  uppercase: true,
}))``;

const AppRow = ({ manifest, appMetadata, onPress }: Props) => {
  const { icon, name, branch } = manifest;
  const { category } = appMetadata || {};
  const { locale } = useLocale();
  const { t } = useTranslation();

  const isDisabled = branch === "soon";
  const showBranchTag = branch !== "stable";

  const handlePress = useCallback(
    () => (!isDisabled && onPress ? onPress(manifest) : null),
    [onPress, manifest, isDisabled],
  );

  const tagContent = showBranchTag
    ? t(`platform.catalog.branch.${manifest.branch}`)
    : category;
  const tagProps = {
    disabled: isDisabled,
    highlight: branch === "experimental",
  };
  const description = translateContent(
    manifest.content.shortDescription,
    locale,
  );
  return (
    <Container
      as={TouchableOpacity}
      disabled={isDisabled}
      onPress={handlePress}
    >
      <LeftContainer>
        <HeaderContainer>
          <AppIcon isDisabled={isDisabled} size={56} name={name} icon={icon} />
          <NameAndTagContainer>
            <AppNameText>{name}</AppNameText>
            {tagContent && (
              <>
                <Flex height="11px" />
                <TagContainer {...tagProps}>
                  <TagText {...tagProps}>{tagContent}</TagText>
                </TagContainer>
              </>
            )}
          </NameAndTagContainer>
        </HeaderContainer>
        <DescriptionContainer>
          <DescriptionText>{description}</DescriptionText>
        </DescriptionContainer>
      </LeftContainer>
      <RightContainer>
        <Icons.ChevronRightMedium size={18} color="neutral.c70" />
      </RightContainer>
    </Container>
  );
};

export default AppRow;
