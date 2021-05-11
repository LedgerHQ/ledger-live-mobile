// @flow

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useTranslation } from "react-i18next";
import { useNavigation, useTheme } from "@react-navigation/native";
import { NavigatorName } from "../../const";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import TrackScreen from "../../analytics/TrackScreen";
import LText from "../../components/LText";
import Wyre from "../../icons/Wyre";
import Button from "../../components/Button";
import Coinify from "../../images/coinify.png";
import FlagUSA from "../../images/flagusa.png";

const forceInset = { bottom: "always" };

const nexts = {
  coinify: NavigatorName.ExchangeBuyFlow,
  wyre: NavigatorName.ExchangeBuyFlowWyre,
};

export default function Buy() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [choice, setChoice] = useState();

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.card,
          paddingTop: extraStatusBarPadding,
        },
      ]}
      forceInset={forceInset}
    >
      <TrackScreen category="Buy Crypto" />
      <View style={styles.body}>
        <LText semiBold style={styles.title}>
          {t("exchange.buy.title")}
        </LText>
        <View style={styles.choices}>
          <TouchableOpacity
            style={[
              styles.choice,
              ...(choice === "wyre" ? [styles.choiceSelected] : []),
            ]}
            onPress={() => setChoice("wyre")}
          >
            <View style={styles.providerContainer}>
              <Wyre width={26} height={32} />
              <LText semiBold style={styles.providerTitle}>
                Wyre
              </LText>
            </View>
            <View style={styles.bullets}>
              <View style={styles.bulletContainer}>
                <View style={styles.bullet} />
                <LText color="smoke" style={styles.bulletText}>
                  {t("exchange.buy.wyre.bullet1")}{" "}
                  <Image source={FlagUSA} style={{ width: 15, height: 15 }} />
                </LText>
              </View>
              <View style={styles.separator2} />
              <View style={styles.bulletContainer}>
                <View style={styles.bullet} />
                <LText color="smoke" style={styles.bulletText}>
                  {t("exchange.buy.wyre.bullet2")}
                </LText>
              </View>
              <View style={styles.separator2} />
              <View style={styles.bulletContainer}>
                <View style={styles.bullet} />
                <LText color="smoke" style={styles.bulletText}>
                  {t("exchange.buy.wyre.bullet3")}
                </LText>
              </View>
              <View style={styles.separator2} />
              <View style={styles.bulletContainer}>
                <View style={styles.bullet} />
                <LText color="smoke" style={styles.bulletText}>
                  {t("exchange.buy.wyre.bullet4")}
                </LText>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={[
              styles.choice,
              ...(choice === "coinify" ? [styles.choiceSelected] : []),
            ]}
            onPress={() => setChoice("coinify")}
          >
            <View style={styles.providerContainer}>
              <Image source={Coinify} style={{ width: 26, height: 32 }} />
              <LText semiBold style={styles.providerTitle}>
                Coinify
              </LText>
            </View>
            <View style={styles.bullets}>
              <View style={styles.bulletContainer}>
                <View style={styles.bullet} />
                <LText color="smoke" style={styles.bulletText}>
                  {t("exchange.buy.coinify.bullet1")}
                </LText>
              </View>
              <View style={styles.separator2} />
              <View style={styles.bulletContainer}>
                <View style={styles.bullet} />
                <LText color="smoke" style={styles.bulletText}>
                  {t("exchange.buy.coinify.bullet2")}
                </LText>
              </View>
              <View style={styles.separator2} />
              <View style={styles.bulletContainer}>
                <View style={styles.bullet} />
                <LText color="smoke" style={styles.bulletText}>
                  {t("exchange.buy.coinify.bullet3")}
                </LText>
              </View>
              <View style={styles.separator2} />
              <View style={styles.bulletContainer}>
                <View style={styles.bullet} />
                <LText color="smoke" style={styles.bulletText}>
                  {t("exchange.buy.coinify.bullet4")}
                </LText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Button
          containerStyle={styles.button}
          event="ExchangeStartBuyFlow"
          type="primary"
          title={t("common.continue")}
          disabled={!choice}
          onPress={() =>
            navigation.navigate(nexts[choice], {
              mode: "buy",
            })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    display: "flex",
    margin: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 16,
  },
  choices: {
    marginTop: 24,
    marginBottom: 24,
    flex: 1,
  },
  choice: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 245, 245, 1)",
  },
  choiceSelected: {
    borderColor: "rgba(100, 144, 241, 1)",
    shadowColor: "rgba(100, 144, 241, 0.3)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  providerTitle: {
    marginLeft: 12,
    fontSize: 16,
  },
  bullets: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bullet: {
    width: 2,
    height: 2,
    borderRadius: 2,
    backgroundColor: "rgba(100, 144, 241, 1)",
  },
  bulletText: {
    fontSize: 15,
    marginLeft: 8,
  },
  separator: {
    height: 16,
  },
  separator2: {
    height: 6,
  },
});
