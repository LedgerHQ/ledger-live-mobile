// @flow
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

import LText from "../../components/LText";
import IconExternalLink from "../../icons/ExternalLink";

type CatalogCTAType = "secondary" | "dashed";

type Props = {
  type: CatalogCTAType,
  children: React$Node,
  title: React$Node,
  onPress: Function,
  Icon: React$ComponentType<{ size: number }>,
  style: ReactNative$StyleProp,
};

const CatalogCTA = ({
  type = "secondary",
  children: description,
  title,
  Icon,
  onPress,
  style,
}: Props) => {
  const { colors } = useTheme();
  const styles = getStyles(colors, type);

  return (
    <TouchableOpacity onPress={() => onPress()}>
      <View style={[styles.root, style]}>
        <View style={styles.content}>
          <View style={styles.head}>
            {Icon && (
              <View style={styles.iconContainer}>
                <Icon size={18} color={styles.title.color} />
              </View>
            )}
            <LText style={styles.title} semiBold>
              {title}
            </LText>
          </View>
          <LText style={styles.description}>{description}</LText>
        </View>
        <IconExternalLink size={18} color={colors.smoke} />
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors, type) =>
  StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 4,
      marginBottom: 24,
      ...(type === "secondary"
        ? { backgroundColor: colors.lightFog }
        : type === "dashed"
        ? {
            borderColor: colors.fog,
            borderStyle: "dashed",
            borderWidth: 1,
          }
        : {}),
    },
    content: {
      flex: 1,
      marginRight: 16,
    },
    head: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    iconContainer: {
      marginRight: 8,
    },
    title: {
      fontSize: 18,

      ...(type === "secondary"
        ? { color: colors.text }
        : type === "dashed"
        ? { color: colors.smoke }
        : { colors: "#fff" }),
    },
    description: {
      fontSize: 14,
      ...(type === "secondary"
        ? { color: colors.smoke }
        : type === "dashed"
        ? { color: colors.text, fontWeight: "800" }
        : { colors: "#fff" }),
    },
  });

export default CatalogCTA;
