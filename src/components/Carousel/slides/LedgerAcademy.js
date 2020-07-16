// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { Linking, Image, View, StyleSheet } from "react-native";
import getWindowDimensions from "../../../logic/getWindowDimensions";
import academy from "../../../images/banners/academy.png";
import LText from "../../LText";
import Button from "../../Button";
import { urls } from "../../../config/urls";
import ExternalLink from "../../../icons/ExternalLink";

const LedgerAcademy = () => {
  const slideWidth = getWindowDimensions().width - 32;
  const onClick = useCallback(() => {
    Linking.openURL(urls.banners.ledgerAcademy);
  }, []);
  return (
    <View style={[styles.wrapper, { width: slideWidth }]}>
      <Image
        style={styles.illustration}
        source={academy}
        width={146}
        height={93}
      />
      <View>
        <LText semiBold secondary style={styles.label}>
          <Trans i18nKey={`carousel.banners.academy.title`} />
        </LText>
        <LText primary style={styles.description}>
          <Trans i18nKey={`carousel.banners.academy.description`} />
        </LText>
        <View style={styles.buttonWrapper}>
          <Button
            IconRight={ExternalLink}
            containerStyle={styles.button}
            titleStyle={{ fontSize: 13 }}
            type="primary"
            small
            onPress={onClick}
            title={<Trans i18nKey={`carousel.banners.academy.cta`} />}
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

export default LedgerAcademy;
