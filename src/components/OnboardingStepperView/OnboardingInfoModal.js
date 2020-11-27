// @flow
import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import colors, { rgba } from "../../colors";
import { normalize } from "../../helpers/normalizeSize";
import ArrowLeft from "../../icons/ArrowLeft";
import Check from "../../icons/Check";
import Question from "../../icons/Question";
import Styles from "../../navigation/styles";
import getWindowDimensions from "../../logic/getWindowDimensions";

import CheckBox from "../CheckBox";
import ConfirmationModal from "../ConfirmationModal";
import LText from "../LText";
import Close from "../../icons/Close";

export type SceneInfoProp = {
  title?: React$Node,
  desc?: React$Node,
  link?: { label: React$Node, url: string },
  bullets: {
    Icon: *,
    title?: React$Node,
    label?: React$Node,
    color?: string,
  }[],
};

type Props = {
  sceneColors: string[],
  sceneInfoProps: SceneInfoProp[],
};

const hitSlop = {
  bottom: 10,
  left: 24,
  right: 24,
  top: 10,
};
const { height } = getWindowDimensions();

export default function OnboardingInfoModal({
  sceneColors,
  sceneInfoProps,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const [primaryColor, accentColor, textColor, bulletColor] = sceneColors;

  return (
    <>
      <Pressable hitSlop={hitSlop} style={styles.buttons} onPress={open}>
        <Question size={20} color={accentColor} />
      </Pressable>
      <ReactNativeModal
        isVisible={isOpen}
        useNativeDriver
        hideModalContentWhileAnimating
        onBackButtonPress={close}
        onBackdropPress={close}
        coverScreen
        style={styles.modal}
      >
        <SafeAreaView style={[styles.root, { backgroundColor: primaryColor }]}>
          <View style={[styles.header]}>
            <View style={styles.topHeader}>
              <Pressable
                hitSlop={hitSlop}
                style={styles.buttons}
                onPress={close}
              >
                <Close size={18} color={textColor} />
              </Pressable>
            </View>
          </View>
          <ScrollView style={styles.root}>
            {sceneInfoProps.map(({ title, desc, link, bullets }, i) => (
              <View key={`infoModalSection-${i}`}>
                {title && (
                  <LText bold style={[styles.title, { color: textColor }]}>
                    {title}
                  </LText>
                )}
                {desc && (
                  <LText semiBold style={[styles.desc, { color: textColor }]}>
                    {desc}
                  </LText>
                )}
                {bullets && (
                  <View style={styles.bulletContainer}>
                    {bullets.map(({ Icon, title, label, color }, i) => (
                      <View style={styles.bulletLine} key={i}>
                        <View
                          style={[
                            styles.bulletIcon,
                            {
                              backgroundColor: color
                                ? rgba(color, 0.1)
                                : bulletColor,
                            },
                          ]}
                        >
                          {Icon ? (
                            <Icon size={10} color={color || colors.live} />
                          ) : (
                            <LText
                              semiBold
                              style={[
                                styles.label,
                                { color: color || colors.live },
                              ]}
                            >
                              {i + 1}
                            </LText>
                          )}
                        </View>
                        <View style={styles.bulletTextContainer}>
                          {title && (
                            <LText
                              semiBold
                              style={[styles.bulletTitle, { color: textColor }]}
                            >
                              {title}
                            </LText>
                          )}
                          <LText style={[styles.label, { color: textColor }]}>
                            {label}
                          </LText>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </ReactNativeModal>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    height,
    justifyContent: "flex-start",
    margin: 0,
  },
  root: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
  },
  spacer: { flex: 1 },
  header: {
    ...Styles.headerNoShadow,
    backgroundColor: "transparent",
    width: "100%",
    overflow: "hidden",
    paddingTop: Platform.OS === "ios" ? 44 : 0,
    height: Platform.OS === "ios" ? 94 : 54,
    flexDirection: "column",
    paddingHorizontal: 24,
  },
  buttons: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  label: { fontSize: 13, lineHeight: 24 },
  desc: { paddingHorizontal: 24 },
  bulletContainer: {
    flexDirection: "column",
    marginVertical: 8,
    paddingHorizontal: 24,
  },
  bulletIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  bulletLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginVertical: 4,
  },
  bulletTextContainer: {
    flexDirection: "column",
    alignContent: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 20,
  },
  bulletTitle: {
    fontSize: 16,
    lineHeight: 24,
  },
});
