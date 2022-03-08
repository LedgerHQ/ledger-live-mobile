import React, { useCallback, useMemo } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View, Linking } from "react-native";
import { useSelector } from "react-redux";
import { Icons, Text, Alert as BaseAlert } from "@ledgerhq/native-ui";
import OldAlert from "./Alert.js";
import { dismissedBannersSelector } from "../reducers/settings";

import IconExternalLink from "../icons/ExternalLink";

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
  left?: React.ReactNode;
  bottom?: React.ReactNode;
  title?: string;
  vertical?: boolean;
  noIcon?: boolean;
  onLearnMore?: () => any;
  learnMoreKey?: string;
  learnMoreUrl?: string;
  learnMoreIsInternal?: boolean;
};

function getAlertProps(type: AlertType) {
  return {
    primary: {
      type: "info",
      icon: Icons.InfoMedium,
    },
    secondary: {
      type: "info",
      icon: Icons.InfoMedium,
    },
    success: {
      type: "info",
      icon: Icons.CircledCheckMedium,
    },
    warning: {
      type: "warning",
      icon: Icons.CircledAlertMedium,
    },
    error: {
      type: "error",
      icon: Icons.CircledCrossMedium,
    },
    hint: {
      type: "info",
      icon: Icons.LightbulbMedium,
    },
    security: {
      type: "warning",
      icon: Icons.ShieldSecurityMedium,
    },
    help: {
      type: "info",
      icon: Icons.ShieldSecurityMedium,
    },
    danger: {
      type: "warning",
      icon: Icons.ShieldSecurityMedium,
    },
    update: {
      type: "",
      icon: null,
    },
  }[type];
}

export default function Alert(props: Props) {
  const {
    id,
    type = "secondary",
    children: description,
    title,
    vertical,
    noIcon,
    onLearnMore,
    learnMoreUrl,
    learnMoreKey,
    learnMoreIsInternal = false,
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

  const learnMore = hasLearnMore && (
    <Text onPress={handleLearnMore}>
      {" "}
      <Text style={[styles.learnMore]} fontSize={3}>
        <Trans i18nKey={learnMoreKey || "common.learnMore"} />
      </Text>
      {!learnMoreIsInternal && (
        <>
          {" "}
          <IconExternalLink size={12} />
        </>
      )}
    </Text>
  );

  const isDismissed = useMemo(() => dismissedBanners.includes(id), [
    dismissedBanners,
    id,
  ]);

  if (type === "update") return <OldAlert {...props} />;

  /** TODO:
   * - cleanup styles
   * - use latest version of lib UI with customizable icon
   * - implement proper design for learnMore link https://www.figma.com/file/wGzwuUVo0rkCJ3sM8cpbDY/LLM-%2F-Library?node-id=5913%3A67123
   */

  return (
    !isDismissed && (
      <BaseAlert {...alertProps}>
        <View style={[styles.root]}>
          <View style={[styles.container, vertical && styles.vertical]}>
            <View style={vertical ? styles.verticalContent : styles.content}>
              {title ? (
                <Text style={[vertical && styles.textCentered]}>{title}</Text>
              ) : null}
              <Text style={[vertical && styles.textCentered]}>
                <Text fontSize={3}>{description}</Text>
                {learnMore}
              </Text>
            </View>
          </View>
        </View>
      </BaseAlert>
    )
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    flexDirection: "column",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  vertical: {
    width: "100%",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    alignItems: "flex-start",
  },
  verticalContent: {
    flex: 0,
    alignItems: "center",
  },
  textCentered: {
    textAlign: "center",
  },
  learnMore: {
    textDecorationLine: "underline",
    marginTop: 8,
  },
});
