// @flow
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Trans } from "react-i18next";
import { TabView, SceneMap } from "react-native-tab-view";
import { TrackScreen } from "../../analytics";
import Button from "../../components/Button";
import colors from "../../colors";
import LText from "../../components/LText";
import { ScreenName } from "../../const";
import AnimatedHeaderView from "../../components/AnimatedHeader";
import newDeviceBg from "./assets/newDevice.png";

import quizScenes from "./shared/quizData";

const InfoView = ({
  label,
  title,
  image,
  answers,
}: {
  label: React$Node,
  title: React$Node,
  image: number,
  answers: {
    title: React$Node,
    correct: boolean,
  }[],
}) => (
  <View style={[styles.root]}>
    <LText style={[styles.label, { color: colors.live }]} bold>
      {label}
    </LText>
    <LText bold style={styles.title}>
      {title}
    </LText>
    <View style={[styles.answerContainer]}>
      {answers.map(({ title }, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.answer, { backgroundColor: colors.white }]}
          onPress={() => {}}
        >
          <LText semiBold style={[styles.answerText, { color: colors.live }]}>
            {title}
          </LText>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={image} resizeMode="cover" />
    </View>
  </View>
);

const scenes = quizScenes.reduce(
  (sum, k, i) => ({
    ...sum,
    [i]: () => (
      <InfoView
        label={k.label}
        title={k.title}
        image={newDeviceBg}
        answers={k.answers}
      />
    ),
  }),
  {},
);

const routeKeys = [0, 1, 2].map(k => ({ key: `${k}` }));

const initialLayout = { width: Dimensions.get("window").width };

function OnboardingQuizz({ navigation, route }: *) {
  // const next = useCallback(() => {
  //   navigation.navigate(ScreenName.OnboardingSetNewDevice, { ...route.params });
  // }, [navigation, route.params]);

  // const userAnswers = useState(() => {
  //   scenes.
  // })

  const [index, setIndex] = useState(0);
  const [routes] = useState(routeKeys);

  const renderScene = SceneMap(scenes);

  const goBack = useCallback(() => {
    if (index > 0) {
      setIndex(idx => idx - 1);
    }
  }, [setIndex, index]);

  return (
    <>
      <AnimatedHeaderView
        style={[styles.header, { backgroundColor: colors.lightLive }]}
        title={null}
        hasBackButton={index !== 0}
        closeAction={() => {
          /* go to next step */
        }}
        backAction={goBack}
        hasCloseButton
      />
      <View style={[styles.root, { backgroundColor: colors.lightLive }]}>
        <TrackScreen category="Onboarding" name="Quizz" />
        <TabView
          renderTabBar={() => null}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          swipeEnabled={false}
        />
        <View style={styles.dotContainer}>
          {quizScenes.map((k, i) => (
            <Pressable
              key={i}
              style={[
                styles.dot,
                index >= i
                  ? { backgroundColor: colors.white }
                  : { backgroundColor: colors.translucentGrey },
              ]}
            >
              <View />
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: { flex: 0 },
  root: {
    flex: 1,
  },
  label: {
    paddingHorizontal: 24,
    textAlign: "center",
    fontSize: 10,
    textTransform: "uppercase",
  },
  title: {
    paddingHorizontal: 24,
    textAlign: "center",
    fontSize: 22,
    marginVertical: 4,
  },
  imageContainer: {
    flex: 1,
    position: "relative",
  },
  image: {
    position: "absolute",
    bottom: -20,
    height: "70%",
    width: "100%",
  },
  dotContainer: {
    position: "absolute",
    bottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  dot: { width: 8, height: 8, margin: 4, borderRadius: 8 },
  answerContainer: {
    padding: 24,
    marginBottom: 24,
  },
  answer: {
    borderRadius: 4,
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignContent: "center",
    justifyContent: "center",
  },
  answerText: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default OnboardingQuizz;
