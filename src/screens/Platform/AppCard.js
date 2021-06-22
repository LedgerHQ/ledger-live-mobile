// @flow

import React, { useCallback } from "react";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import { translateContent } from "@ledgerhq/live-common/lib/platform/logic";

import { useLocale } from "../../context/Locale";

import LText from "../../components/LText";
import IconChevron from "../../icons/ArrowRight";

import AppIcon from "./AppIcon";

function getBranchStyle(branch, colors) {
  switch (branch) {
    case "soon":
      return {
        color: colors.live,
        borderColor: colors.lightLiveBg,
        backgroundColor: colors.lightLiveBg,
      };
    case "experimental":
      return {
        color: colors.orange,
        borderColor: colors.orange,
        backgroundColor: "transparent",
      };
    case "debug":
      return {
        color: colors.grey,
        borderColor: colors.grey,
        backgroundColor: "transparent",
      };
    default:
      return {
        color: colors.live,
        borderColor: colors.live,
        backgroundColor: "transparent",
      };
  }
}

const AppCard = ({
  manifest,
  onPress,
}: {
  manifest: AppManifest,
  onPress: string => void,
}) => {
  const { colors } = useTheme();
  const { locale } = useLocale();
  const { t } = useTranslation();
  const isDisabled = manifest.branch === "soon";

  const handlePress = useCallback(
    () => (!isDisabled && onPress ? onPress(manifest) : null),
    [onPress, manifest, isDisabled],
  );

  const Wrapper = isDisabled ? View : TouchableOpacity;

  return (
    <Wrapper onPress={handlePress}>
      <View
        style={[
          styles.wrapper,
          isDisabled && styles.disabled,
          {
            backgroundColor: colors.card,
            ...Platform.select({
              android: {},
              ios: {
                shadowColor: colors.black,
              },
            }),
          },
        ]}
      >
        <AppIcon size={48} name={manifest.name} icon={manifest.icon} />
        <View style={styles.content}>
          <View style={styles.header}>
            <LText style={styles.title} numberOfLines={1} semiBold>
              {manifest.name}
            </LText>
            {manifest.branch !== "stable" && (
              <LText
                style={[styles.branch, getBranchStyle(manifest.branch, colors)]}
                semiBold
              >
                {t(`platform.catalog.branch.${manifest.branch}`, {
                  defaultValue: manifest.branch,
                })}
              </LText>
            )}
          </View>
          <LText
            style={[styles.description, { color: colors.smoke }]}
            numberOfLines={2}
          >
            {translateContent(manifest.content.shortDescription, locale)}
          </LText>
        </View>
        {!isDisabled && <IconChevron size={18} color={colors.smoke} />}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: {
          height: 4,
        },
      },
    }),
  },
  disabled: {
    opacity: 0.8,
  },
  content: {
    marginHorizontal: 16,
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    flexGrow: 0,
    flexShrink: 1,
    overflow: "hidden",
  },
  branch: {
    fontSize: 9,
    width: "auto",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderStyle: "solid",
    flexGrow: 0,
    flexShrink: 0,
    marginLeft: 8,
    overflow: "hidden",
    textTransform: "uppercase",
  },
});

export default AppCard;
