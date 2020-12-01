// @flow
import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import colors from "../../colors";
import { ScreenName } from "../../const";
import ArrowLeft from "../../icons/ArrowLeft";
import Question from "../../icons/Question";
import Styles from "../../navigation/styles";

import type { SceneInfoProp } from "./OnboardingInfoModal";
import { InfoStepView } from "./OnboardingStepView";

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
      (s, { sceneProps, id }) => ({
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
          {scenes.map(({ id }, i) => (
            <View
              key={"indicator" + id + i}
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
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sceneIndicator: { flex: 1, height: 2, marginHorizontal: 4 },
});
