// @flow

import React, { useContext, useState, useEffect } from "react";
import { Trans } from "react-i18next";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import LText from "../../components/LText";
import Button from "../../components/Button";
import ArrowRight from "../../icons/ArrowRight";
import Close from "../../icons/Close";
import colors from "../../colors";
import { context, STEPS, dismiss } from "./Provider";
import { navigate } from "../../rootnavigation";
import { NavigatorName, ScreenName } from "../../const";

type Props = {
  navigation: any,
};

const PortfolioWidget = () => {
  const ptContext = useContext(context);
  const [started, setStarted] = useState(!!ptContext.completedSteps.length);

  useEffect(() => {
    setStarted(!!ptContext.completedSteps.length);
  }, [ptContext.completedSteps.length, ptContext.dismissed]);

  if (ptContext.dismissed) {
    return null;
  }

  return (
    <View style={[styles.root, ...(!started ? [styles.rootNotStarted] : [])]}>
      {!started ? (
        <>
          <Image
            source={require("../../images/producttourwidget.png")}
            style={styles.image}
          />
          <LText style={styles.title} bold>
            <Trans i18nKey="producttour.widget.title" />
          </LText>
          <LText style={styles.title2} bold>
            <Trans i18nKey="producttour.widget.title2" />
          </LText>
        </>
      ) : null}

      {started ? (
        <>
          <TouchableOpacity
            style={styles.dismiss}
            onPress={() => dismiss(true)}
          >
            <Close size={16} color={colors.white} />
          </TouchableOpacity>
          <LText style={styles.title} bold>
            <Trans i18nKey="producttour.widget.startedtitle" />
          </LText>
          <LText secondary style={styles.startedtitle2} bold>
            <Trans
              i18nKey={
                ptContext.completedSteps.length === Object.keys(STEPS).length
                  ? "producttour.widget.startedtitlecomplete"
                  : "producttour.widget.startedtitle2"
              }
              values={{
                count:
                  Object.keys(STEPS).length - ptContext.completedSteps.length,
              }}
            />
          </LText>
        </>
      ) : null}

      <Button
        type="negativePrimary"
        event={`start tour ${started ? "started" : ""}`}
        onPress={() => {
          if (!started) {
            return setStarted(true);
          }
          navigate(NavigatorName.ProductTour, {
            screen: ScreenName.ProductTourMenu,
          });
        }}
        title={
          started ? (
            <Trans i18nKey="producttour.widget.cta" />
          ) : (
            <Trans i18nKey="producttour.widget.startedcta" />
          )
        }
        IconRight={ArrowRight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 16,
    backgroundColor: colors.live,
    paddingTop: 67,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    marginBottom: 24,
  },
  rootNotStarted: {
    marginTop: 37,
  },
  title: {
    fontSize: 10,
    color: colors.white,
  },
  title2: {
    fontSize: 28,
    color: colors.white,
    marginTop: 8,
    marginBottom: 24,
  },
  startedtitle2: {
    fontSize: 22,
    color: colors.white,
    marginTop: 8,
    marginBottom: 24,
  },
  dismiss: {
    position: "absolute",
    top: 27,
    left: 19,
  },
  image: {
    position: "absolute",
    right: 0,
    top: -37,
    width: 213,
    height: 160,
  },
});

export default PortfolioWidget;
