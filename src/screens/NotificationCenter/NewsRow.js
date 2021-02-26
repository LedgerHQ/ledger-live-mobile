// @flow
import React from "react";
import { View, StyleSheet, Linking } from "react-native";

import type { Announcement } from "@ledgerhq/live-common/lib/announcements/types";
import { useTheme } from "@react-navigation/native";
import { Trans } from "react-i18next";
import LText from "../../components/LText";
import Info from "../../icons/Info";
import Warning from "../../icons/WarningOutline";
import ExternalLink from "../../components/ExternalLink";

type Props = {
  item: Announcement,
  index: number,
  style?: *,
};

const icons = {
  info: Info,
  warning: Warning,
};

export default function NewsRow({ item, style }: Props) {
  const { colors } = useTheme();
  const { content, uuid, level, icon } = item;
  const { title, text, link } = content;

  const iconColors = {
    info: colors.live,
    warning: colors.orange,
  };

  const Icon = icon && icons[icon];
  const iconColor = icon && iconColors[icon];
  const { backgroundColor, color } =
    level === "warning"
      ? { backgroundColor: colors.orange, color: "#FFF" }
      : {};

  return (
    <View
      style={[styles.root, style, backgroundColor ? { backgroundColor } : null]}
    >
      <View style={styles.leftSection}>
        {Icon && <Icon size={16} color={color || iconColor} />}
      </View>
      <View style={styles.rightSection}>
        <LText
          semiBold
          style={[styles.title, { color: color || colors.darkBlue }]}
        >
          {title}
        </LText>
        {text && (
          <LText style={[styles.text, { color: color || colors.grey }]}>
            {text}
          </LText>
        )}
        {link && (
          <View style={styles.link}>
            <ExternalLink
              event="NewsLearnMore"
              eventProperties={{ uuid }}
              text={link.label || <Trans i18nKey="common.learnMore" />}
              color={color}
              onPress={() => Linking.openURL(link.href)}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  leftSection: {
    width: 16,
    marginRight: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  rightSection: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
  },
  link: {
    marginTop: 16,
  },
});
