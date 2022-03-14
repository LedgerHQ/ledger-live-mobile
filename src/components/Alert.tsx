import React, { useCallback, useMemo } from "react";
import { Trans } from "react-i18next";
import { Linking, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Icons, Text, Alert as BaseAlert, Flex } from "@ledgerhq/native-ui";
import styled from "styled-components/native";
import { dismissedBannersSelector } from "../reducers/settings";

type AlertType =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "hint"
  | "security"
  | "help"
  | "danger"
  | "update";

type Props = {
  id?: string;
  type: AlertType;
  children: React.ReactNode;
  title?: string;
  noIcon?: boolean;
  onLearnMore?: () => any;
  learnMoreKey?: string;
  learnMoreUrl?: string;
  learnMoreIsInternal?: boolean;
  learnMoreIcon?: IconType;
};

function getAlertProps(type: AlertType) {
  return {
    primary: {
      type: "info",
      Icon: Icons.InfoMedium,
    },
    secondary: {
      type: "info",
      Icon: Icons.InfoMedium,
    },
    success: {
      type: "info",
      Icon: Icons.CircledCheckMedium,
    },
    warning: {
      type: "warning",
      Icon: Icons.CircledAlertMedium,
    },
    error: {
      type: "error",
      Icon: Icons.CircledCrossMedium,
    },
    hint: {
      type: "info",
      Icon: Icons.LightbulbMedium,
    },
    security: {
      type: "warning",
      Icon: Icons.ShieldSecurityMedium,
    },
    help: {
      type: "info",
      Icon: Icons.ShieldSecurityMedium,
    },
    danger: {
      type: "error",
      Icon: Icons.ShieldSecurityMedium,
    },
    update: {
      type: "warning",
      Icon: Icons.WarningMedium,
    },
  }[type];
}

type IconType = React.ComponentType<{ size: number; color: string }>;

type LearnMoreLinkProps = {
  color: string;
  onPress?: () => void;
  learnMoreIsInternal?: boolean;
  learnMoreKey?: string;
  Icon?: IconType;
};

const StyledText = styled(Text).attrs({
  variant: "bodyLineHeight",
  fontWeight: "medium",
})``;

const UnderlinedText = styled(StyledText)`
  text-decoration-line: underline;
`;

const LinkTouchable = styled(TouchableOpacity).attrs({
  activeOpacity: 0.5,
})`
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const LearnMoreLink = ({
  onPress,
  learnMoreIsInternal,
  learnMoreKey,
  color,
  Icon,
}: LearnMoreLinkProps) => {
  const IconComponent = Icon || Icons.ExternalLinkMedium;
  return (
    <LinkTouchable onPress={onPress}>
      <UnderlinedText mr="5px" color={color}>
        <Trans i18nKey={learnMoreKey || "common.learnMore"} />
      </UnderlinedText>
      {(Icon || !learnMoreIsInternal) && (
        <IconComponent size={16} color={color} />
      )}
    </LinkTouchable>
  );
};

const Container = styled(Flex).attrs({
  width: "100%",
  flexDirection: "column",
  flex: 1,
  alignItems: "flex-start",
})``;

export default function Alert(props: Props) {
  const {
    id,
    type = "secondary",
    children: description,
    title,
    noIcon,
    onLearnMore,
    learnMoreUrl,
    learnMoreKey,
    learnMoreIsInternal = false,
    learnMoreIcon,
  } = props;

  const dismissedBanners = useSelector(dismissedBannersSelector);

  const alertProps = useMemo(
    () => ({
      ...getAlertProps(type),
      showIcon: !noIcon,
    }),
    [type, noIcon],
  );

  const hasLearnMore = !!onLearnMore || !!learnMoreUrl;
  const handleLearnMore = useCallback(
    () =>
      onLearnMore
        ? onLearnMore()
        : learnMoreUrl
        ? Linking.openURL(learnMoreUrl)
        : undefined,
    [onLearnMore, learnMoreUrl],
  );

  const isDismissed = useMemo(() => dismissedBanners.includes(id), [
    dismissedBanners,
    id,
  ]);

  return (
    !isDismissed && (
      <BaseAlert
        {...alertProps}
        renderContent={({ textColor }) => (
          <Container>
            {title && <StyledText color={textColor}>{title}</StyledText>}
            {description && (
              <StyledText
                mt={title ? "6px" : undefined}
                mb={hasLearnMore ? "6px" : undefined}
                color={textColor}
              >
                {description}
              </StyledText>
            )}
            {hasLearnMore && (
              <LearnMoreLink
                color={textColor}
                onPress={handleLearnMore}
                learnMoreKey={learnMoreKey}
                learnMoreIsInternal={learnMoreIsInternal}
                Icon={learnMoreIcon}
              />
            )}
          </Container>
        )}
      />
    )
  );
}
