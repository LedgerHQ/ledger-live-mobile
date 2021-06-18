// @flow

import React from "react";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, Platform, TouchableOpacity } from "react-native";

import LText from "../../components/LText";
import IconChevron from "../../icons/ArrowRight";

import AppIcon from "./AppIcon";

const AppCard = ({
  manifest,
  onPress,
}: {
  manifest: AppManifes,
  onPress: string => void,
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => onPress(manifest)}>
      <View
        style={[
          styles.wrapper,
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
          <LText style={styles.title} semiBold>
            {manifest.name}
          </LText>
          <LText
            style={[styles.bulletText, { color: colors.smoke }]}
            numberOfLines={2}
          >
            {manifest.content.description.en}
          </LText>
        </View>
        <IconChevron size={18} color={colors.smoke} />
      </View>
    </TouchableOpacity>
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
  content: {
    marginHorizontal: 16,
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 14,
  },
  title: {
    fontSize: 16,
  },
});

export default AppCard;
