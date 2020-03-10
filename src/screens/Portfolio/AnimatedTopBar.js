// @flow

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Animated,
  View,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import type AnimatedValue from "react-native/Libraries/Animated/src/nodes/AnimatedValue";
import type { Portfolio, Currency } from "@ledgerhq/live-common/lib/types";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import BalanceHeader from "./BalanceHeader";
import HeaderErrorTitle from "../../components/HeaderErrorTitle";
import HeaderSynchronizing from "../../components/HeaderSynchronizing";
import { headerPressSubject } from "../../navigation/utils";

interface Props {
  scrollY: AnimatedValue;
  portfolio: Portfolio;
  counterValueCurrency: Currency;
  pending: boolean;
  error: ?Error;
}

export default function AnimatedTopBar({
  scrollY,
  portfolio,
  counterValueCurrency,
  pending,
  error,
}: Props) {
  const [ignorePointerEvents, setIgnorePointerEvents] = useState(true);

  useEffect(() => {
    scrollY.addListener(({ value }) => {
      setIgnorePointerEvents(value < 90);
    });

    return () => {
      scrollY.removeAllListeners();
    };
  }, [scrollY]);

  function onPress() {
    headerPressSubject.next();
  }

  const opacity = scrollY.interpolate({
    inputRange: [90, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      pointerEvents={ignorePointerEvents ? "none" : "auto"}
      style={[styles.root, { opacity }]}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.outer, { paddingTop: extraStatusBarPadding }]}>
          <SafeAreaView>
            {pending ? (
              <View style={styles.content}>
                <HeaderSynchronizing />
              </View>
            ) : error ? (
              <View style={styles.content}>
                <HeaderErrorTitle error={error} />
              </View>
            ) : (
              <BalanceHeader
                counterValueCurrency={counterValueCurrency}
                portfolio={portfolio}
              />
            )}
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
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
  outer: {
    overflow: "hidden",
  },
  content: {
    justifyContent: "center",
    paddingVertical: 8,
    height: 56,
  },
});
