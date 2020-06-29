// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { Image, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import getWindowDimensions from "../../../logic/getWindowDimensions";
import buyCrypto from "../../../images/banners/buycrypto.png";
import LText from "../../LText";
import Button from "../../Button";
import { NavigatorName } from "../../../const";

const BuyCrypto = () => {
  const slideWidth = getWindowDimensions().width - 32;
  const navigation = useNavigation();
  const onClick = useCallback(() => {
    navigation.navigate(NavigatorName.Exchange);
  }, [navigation]);

  return (
    <View style={[styles.wrapper, { width: slideWidth }]}>
      <Image
        style={styles.illustration}
        source={buyCrypto}
        width={146}
        height={93}
      />
      <View>
        <LText semiBold secondary style={styles.label}>
          <Trans i18nKey={`carousel.banners.buyCrypto.title`} />
        </LText>
        <LText primary style={styles.description}>
          <Trans i18nKey={`carousel.banners.buyCrypto.description`} />
        </LText>
        <View style={styles.buttonWrapper}>
          <Button
            containerStyle={styles.button}
            titleStyle={{ fontSize: 13 }}
            type="primary"
            small
            onPress={onClick}
            title={<Trans i18nKey={`carousel.banners.buyCrypto.cta`} />}
            event=""
          />
          <View style={{ flexGrow: 1 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  illustration: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  wrapper: {
    width: "100%",
    height: "100%",
    padding: 16,
    paddingBottom: 0,
    position: "relative",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    marginBottom: 16,
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.5,
    color: "white",
    fontSize: 10,
    lineHeight: 15,
  },
  description: {
    color: "white",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 16,
  },
  layer: {
    position: "absolute",
  },
});

export default BuyCrypto;
