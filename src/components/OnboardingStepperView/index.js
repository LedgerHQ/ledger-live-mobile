// @flow
import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import colors from "../../colors";
import { ScreenName } from "../../const";
import { normalize } from "../../helpers/normalizeSize";
import ArrowLeft from "../../icons/ArrowLeft";
import Question from "../../icons/Question";
import Styles from "../../navigation/styles";

import CheckBox from "../CheckBox";
import ConfirmationModal from "../ConfirmationModal";
import LText from "../LText";

import type { SceneInfoProp } from "./OnboardingInfoModal";

export type OnboardingScene = {
  id: string,
  sceneProps: InfoStepViewProps,
  type: "primary" | "secondary",
  sceneInfoModalProps?: SceneInfoProp[],
};

type Props = {
  scenes: OnboardingScene[],
  navigation: *,
  route: *,
  onFinish: () => void,
};

const hitSlop = {
  bottom: 10,
  left: 24,
  right: 24,
  top: 10,
};

const initialLayout = { width: Dimensions.get("window").width };
const headerHeight = Platform.OS === "ios" ? 134 : 94;

export default function OnboardingStepperView({
  scenes,
  navigation,
  route,
  onFinish,
}: Props) {
  const next = useCallback(() => {}, [navigation, route.params]);

  const [index, setIndex] = useState(0);
  const [routes] = useState(scenes.map(({ id }) => ({ key: id })));

  const onNext = useCallback(() => {
    setIndex(Math.min(scenes.length - 1, index + 1));
  }, [index, scenes.length]);

  const onBack = useCallback(() => {
    if (index === 0) navigation.goBack();
    else setIndex(Math.max(0, index - 1));
  }, [navigation, index]);

  const currentScene = useMemo(() => scenes[index], [scenes, index]);

  const openInfoModal = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingInfoModal, {
      sceneInfoProps: currentScene?.sceneInfoModalProps,
    });
  }, [currentScene?.sceneInfoModalProps, navigation]);

  const sceneColors =
    currentScene?.type === "primary"
      ? [colors.live, "#fff", "#fff", "#fff", "rgba(255,255,255,0.3)"]
      : [
          "#fff",
          colors.live,
          colors.darkBlue,
          colors.lightLive,
          colors.lightLive,
        ];

  const renderScenes = SceneMap(
    scenes.reduce(
      (s, { sceneProps, id, type }) => ({
        ...s,
        [id]: () => (
          <InfoStepView
            {...sceneProps}
            onNext={onNext}
            sceneColors={sceneColors}
            openInfoModal={openInfoModal}
          />
        ),
      }),
      {},
    ),
  );

  return scenes && scenes.length ? (
    <SafeAreaView style={[styles.root, { backgroundColor: sceneColors[0] }]}>
      <View style={[styles.header]}>
        <View style={styles.topHeader}>
          <Pressable hitSlop={hitSlop} style={styles.buttons} onPress={onBack}>
            <ArrowLeft size={18} color={sceneColors[1]} />
          </Pressable>
          {currentScene?.sceneInfoModalProps && (
            <Pressable
              hitSlop={hitSlop}
              style={styles.buttons}
              onPress={openInfoModal}
            >
              <Question size={20} color={sceneColors[1]} />
            </Pressable>
          )}
        </View>
        <View style={styles.indicatorContainer}>
          {scenes.map((s, i) => (
            <View
              key={i}
              style={[
                styles.sceneIndicator,
                {
                  backgroundColor:
                    index === i ? sceneColors[1] : sceneColors[4],
                },
              ]}
            />
          ))}
        </View>
      </View>
      <TabView
        renderTabBar={() => null}
        navigationState={{ index, routes }}
        renderScene={renderScenes}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        swipeEnabled={false}
      />
    </SafeAreaView>
  ) : null;
}

type InfoStepViewProps = {
  title?: React$Node,
  desc?: React$Node,
  image?: number,
  bullets?: {
    Icon?: *,
    label: React$Node,
    title?: React$Node,
    index?: number,
  }[],
  ctaText?: React$Node,
  ctaWarningModal?: {
    Icon?: *,
    image?: number,
    title: React$Node,
    desc?: React$Node,
    ctaText: React$Node,
  },
  infoModalLink?: { label: React$Node },
  ctaWarningCheckbox?: { desc: React$Node },
};

export function InfoStepView({
  title,
  desc,
  image,
  bullets,
  ctaText,
  ctaWarningModal,
  ctaWarningCheckbox,
  infoModalLink,
  onNext,
  sceneColors,
  openInfoModal,
}: InfoStepViewProps & {
  onNext: () => void,
  sceneColors: string[],
  openInfoModal: () => void,
}) {
  const [primaryColor, accentColor, textColor, bulletColor] = sceneColors;
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);

  const onOpenInfoModal = useCallback(() => setInfoModalOpen(true), []);
  const onCloseInfoModal = useCallback(() => setInfoModalOpen(false), []);
  const onConfirmInfo = useCallback(() => {
    onCloseInfoModal();
    onNext();
  }, [onCloseInfoModal, onNext]);

  const [hasValidatedCheckbox, setHasValidatedCheckbox] = useState(false);

  const isDisabled = useMemo(
    () => !!ctaWarningCheckbox && !hasValidatedCheckbox,
    [ctaWarningCheckbox, hasValidatedCheckbox],
  );

  return (
    <View style={styles.infoStepView}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={image} resizeMode="contain" />
        </View>
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <ScrollView>
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
            {bullets.map(({ Icon, title, label, index }, i) => (
              <View style={styles.bulletLine} key={i}>
                <View
                  style={[styles.bulletIcon, { backgroundColor: bulletColor }]}
                >
                  {Icon ? (
                    <Icon size={10} color={colors.live} />
                  ) : (
                    <LText
                      semiBold
                      style={[styles.label, { color: colors.live }]}
                    >
                      {index || i + 1}
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
      </ScrollView>
      {infoModalLink && (
        <Pressable onPress={openInfoModal} style={styles.linkContainer}>
          <LText semiBold style={[styles.link, { color: textColor }]}>
            {infoModalLink.label}
          </LText>
          <Question size={16} color={textColor} />
        </Pressable>
      )}
      {ctaWarningCheckbox && (
        <View style={styles.warningCheckboxContainer}>
          <CheckBox
            style={styles.checkbox}
            onChange={setHasValidatedCheckbox}
            isChecked={hasValidatedCheckbox}
          />
          <LText
            onPress={() => setHasValidatedCheckbox(!hasValidatedCheckbox)}
            style={[styles.checkboxLabel, { color: textColor }]}
          >
            {ctaWarningCheckbox.desc}
          </LText>
        </View>
      )}

      <Pressable
        style={[
          styles.ctaButton,
          {
            backgroundColor: isDisabled ? "rgba(0,0,0,0.1)" : accentColor,
          },
        ]}
        disabled={isDisabled}
        onPress={ctaWarningModal ? onOpenInfoModal : onNext}
      >
        <LText
          semiBold
          style={[
            styles.ctaLabel,
            { color: isDisabled ? "rgba(0,0,0,0.3)" : primaryColor },
          ]}
        >
          {ctaText}
        </LText>
      </Pressable>
      {ctaWarningModal && (
        <ConfirmationModal
          isOpened={isInfoModalOpen}
          onClose={onCloseInfoModal}
          onConfirm={onConfirmInfo}
          confirmationTitle={ctaWarningModal.title}
          confirmationDesc={ctaWarningModal.desc}
          image={ctaWarningModal.image}
          Icon={ctaWarningModal.Icon}
          confirmButtonText={ctaWarningModal.ctaText}
          hideRejectButton
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  spacer: { flex: 1 },
  header: {
    ...Styles.headerNoShadow,
    backgroundColor: "transparent",
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 84 : 40,
    height: headerHeight,
    flexDirection: "column",
    overflow: "hidden",
    paddingHorizontal: 24,
  },
  buttons: {
    paddingVertical: 16,
  },

  infoStepView: {
    paddingVertical: 24,
    flex: 1,
  },
  title: {
    fontSize: normalize(32),
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
    flex: 1,
    marginLeft: 20,
  },
  bulletTitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  warningCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 16,
    marginHorizontal: 24,
  },
  checkbox: { borderRadius: 4, width: 24, height: 24 },
  checkboxLabel: { fontSize: 13, marginLeft: 11 },
  imageContainer: {
    flex: 1,
    minHeight: 100,
    position: "relative",
  },
  image: { position: "absolute", width: "100%", height: "100%" },
  imagePlaceholder: { flexBasis: 100, flexShrink: 1 },
  ctaButton: {
    height: 50,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
  },
  ctaLabel: {
    fontSize: 15,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sceneIndicator: { flex: 1, height: 2, marginHorizontal: 4 },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 16,
    marginHorizontal: 24,
    paddingVertical: 16,
  },
  link: {
    fontSize: 15,
    paddingRight: 8,
  },
});
