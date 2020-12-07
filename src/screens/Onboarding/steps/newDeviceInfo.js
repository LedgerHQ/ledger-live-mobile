// @flow

import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { Trans } from "react-i18next";
import { TabView, SceneMap } from "react-native-tab-view";
import { TrackScreen } from "../../../analytics";
import Button from "../../../components/Button";
import colors from "../../../colors";
import LText from "../../../components/LText";
import { ScreenName } from "../../../const";
import AnimatedHeaderView from "../../../components/AnimatedHeader";

import Animation from "../../../components/Animation";

import animations from "../assets/Set_Up_New_Device.json";

const InfoView = ({
  label,
  title,
  desc,
  onCtaPress,
}: {
  label: React$Node,
  title: React$Node,
  desc: React$Node,
  onCtaPress?: () => void,
}) => (
  <View style={[styles.root]}>
    <LText style={[styles.label, { color: colors.live }]} bold>
      {label}
    </LText>
    <LText bold style={styles.title}>
      {title}
    </LText>
    <LText style={styles.desc}>{desc}</LText>
    {onCtaPress && (
      <View style={styles.button}>
        <Button
          event="Onboarding NewDevice CTA"
          type="primary"
          title={<Trans i18nKey="onboarding.stepNewDevice.cta" />}
          onPress={onCtaPress}
        />
      </View>
    )}
  </View>
);

const scenes = [0, 1, 2, 3].reduce(
  (sum, k) => ({
    ...sum,
    [k]: () => (
      <InfoView
        label={<Trans i18nKey={`onboarding.stepNewDevice.${k}.label`} />}
        title={<Trans i18nKey={`onboarding.stepNewDevice.${k}.title`} />}
        desc={<Trans i18nKey={`onboarding.stepNewDevice.${k}.desc`} />}
      />
    ),
  }),
  {},
);

const animProgressions = [0.15, 0.35, 0.55, 0.72, 0.95];

const routeKeys = [0, 1, 2, 3, 4].map(k => ({ key: `${k}` }));

const initialLayout = { width: Dimensions.get("window").width };

function OnboardingStepNewDevice({ navigation, route }: *) {
  const next = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingSetNewDevice, { ...route.params });
  }, [navigation, route.params]);

  const [index, setIndex] = useState(0);

  const [p] = useState(new Animated.Value(0.0));

  const [routes] = useState(routeKeys);

  const startAnim = useCallback(
    i => {
      Animated.sequence([
        // first we animate to next index
        Animated.timing(p, {
          toValue: animProgressions[i],
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // then we loop a bit backward and forward to keep animation going
        Animated.loop(
          Animated.sequence([
            Animated.timing(p, {
              toValue: animProgressions[i] - 0.05,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(p, {
              toValue: animProgressions[i],
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]).start();
    },
    [p],
  );

  useEffect(() => {
    startAnim(0);
  }, []);

  const switchIndex = useCallback(
    i => {
      setIndex(i);
      startAnim(i);
    },
    [startAnim],
  );

  const renderScene = SceneMap({
    ...scenes,
    "4": () => (
      <InfoView
        label={<Trans i18nKey={`onboarding.stepNewDevice.4.label`} />}
        title={<Trans i18nKey={`onboarding.stepNewDevice.4.title`} />}
        desc={<Trans i18nKey={`onboarding.stepNewDevice.4.desc`} />}
        onCtaPress={next}
      />
    ),
  });

  return (
    <>
      <AnimatedHeaderView
        style={[styles.header, { backgroundColor: colors.lightLive }]}
        title={null}
        hasBackButton
      />
      <View style={[styles.root, { backgroundColor: colors.lightLive }]}>
        <TrackScreen category="Onboarding" name="NewDeviceInfo" />
        <TabView
          renderTabBar={() => null}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={switchIndex}
          initialLayout={initialLayout}
        />
        <View style={styles.svg}>
          <Animation
            progress={p}
            style={{ width: "100%", height: "100%" }}
            source={animations}
            loop={false}
            autoplay={false}
          />
        </View>

        <View style={styles.dotContainer}>
          {[0, 1, 2, 3, 4].map(k => (
            <Pressable
              key={k}
              style={[
                styles.dot,
                index >= k
                  ? { backgroundColor: colors.white }
                  : { backgroundColor: colors.translucentGrey },
              ]}
              onPress={() => setIndex(k)}
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
    marginTop: 24,
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
  desc: {
    paddingHorizontal: 24,
    textAlign: "center",
    fontSize: 14,
    marginBottom: 24,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 42,
    position: "relative",
  },
  image: {
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: "100%",
  },
  button: { paddingHorizontal: 24, marginTop: 16 },
  dotContainer: {
    position: "absolute",
    bottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  dot: { width: 8, height: 8, margin: 4, borderRadius: 8 },
  svg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "45%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
});

export default OnboardingStepNewDevice;
