// @flow

import React, { useCallback, useState } from "react";
import { StyleSheet, View, Dimensions, Image, Pressable } from "react-native";
import { Trans } from "react-i18next";
import { TabView, SceneMap } from "react-native-tab-view";
import Svg, { Ellipse } from "react-native-svg";
import { TrackScreen } from "../../../analytics";
import Button from "../../../components/Button";
import colors from "../../../colors";
import LText from "../../../components/LText";
import { ScreenName } from "../../../const";
import AnimatedHeaderView from "../../../components/AnimatedHeader";

import setupDeviceSlide1 from "../assets/setupDeviceSlide_1.png";
import setupDeviceSlide2 from "../assets/setupDeviceSlide_2.png";
import setupDeviceSlide3 from "../assets/setupDeviceSlide_3.png";
import setupDeviceSlide4 from "../assets/setupDeviceSlide_4.png";
import setupDeviceSlide5 from "../assets/setupDeviceSlide_5.png";

const images = [
  setupDeviceSlide1,
  setupDeviceSlide2,
  setupDeviceSlide3,
  setupDeviceSlide4,
  setupDeviceSlide5,
];

const InfoView = ({
  label,
  title,
  desc,
  image,
  onCtaPress,
}: {
  label: React$Node,
  title: React$Node,
  desc: React$Node,
  image: number,
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
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={image} resizeMode="cover" />
    </View>
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
        image={images[k]}
      />
    ),
  }),
  {},
);

const routeKeys = [0, 1, 2, 3, 4].map(k => ({ key: `${k}` }));

const initialLayout = { width: Dimensions.get("window").width };

function OnboardingStepNewDevice({ navigation, route }: *) {
  const next = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingSetNewDevice, { ...route.params });
  }, [navigation, route.params]);

  const [index, setIndex] = useState(0);
  const [routes] = useState(routeKeys);

  const renderScene = SceneMap({
    ...scenes,
    "4": () => (
      <InfoView
        label={<Trans i18nKey={`onboarding.stepNewDevice.4.label`} />}
        title={<Trans i18nKey={`onboarding.stepNewDevice.4.title`} />}
        desc={<Trans i18nKey={`onboarding.stepNewDevice.4.desc`} />}
        image={images[4]}
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
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        />
        <Svg style={styles.svg} viewBox="0 0 320 196" fill="none">
          <Ellipse cx="165" cy="208.22" rx="507" ry="208.032" fill="#495D7F" />
        </Svg>
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
    zIndex: -1,
  },
});

export default OnboardingStepNewDevice;
