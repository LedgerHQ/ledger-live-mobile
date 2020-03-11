// @flow

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import Animated from "react-native-reanimated";
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

const { call, cond, interpolate, lessThan, useCode } = Animated;

export default function AnimatedTopBar({
  scrollY,
  portfolio,
  counterValueCurrency,
  pending,
  error,
}: Props) {
  const [isShown, setIsShown] = useState(false);

  function onPress() {
    headerPressSubject.next();
  }

  const opacity = interpolate(scrollY, {
    inputRange: [90, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  useCode(
    () =>
      cond(
        lessThan(scrollY, 90),
        call([], () => {
          setIsShown(false);
        }),
        call([], () => {
          setIsShown(true);
        }),
      ),
    [isShown],
  );

  return (
    <Animated.View
      style={[styles.root, { opacity }]}
      pointerEvents={isShown ? "auto" : "none"}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.outer, { paddingTop: extraStatusBarPadding }]}>
          <View>
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
          </View>
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
