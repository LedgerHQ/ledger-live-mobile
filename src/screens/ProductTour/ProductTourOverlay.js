// @flow

import { useTheme } from "@react-navigation/native";
import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { RNHoleView, ERNHoleViewTimingFunction } from "react-native-hole-view";
import { Trans } from "react-i18next";
import { context } from "./Provider";
import { ScreenName, NavigatorName } from "../../const";
import { navigate } from "../../rootnavigation";
import LText from "../../components/LText";

const configs = {
  "Porfolio-ManagerTab": [
    {
      layout: "ManagerTab",
      arrow: require("../../images/producttour/arrow-bottomright.png"),
      text: "producttour.overlay.Porfolio-ManagerTab",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Porfolio-AccountsTab": [
    {
      layout: "AccountsTab",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Porfolio-AccountsTab",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Porfolio-TransferTab": [
    {
      layout: "TransferTab",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Porfolio-TransferTab",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Porfolio-TransferTab-Send": [
    {
      layout: "TransferTab",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Porfolio-TransferTab-Send",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Transfer-Send": [
    {
      layout: "modal",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Transfer-Send",
      disableSkip: true,
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Transfer-Receive": [
    {
      layout: "modal",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Transfer-Receive",
      disableSkip: true,
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Device-Instructions": [
    {
      layout: "modal",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Device-Instructions",
      disableSkip: true,
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Send-accountsList": [
    {
      layout: "send-accountsList",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Send-accountsList",
      arrowPosition: ({ x, y, height, width }) => ({
        left: x + width / 2,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Send-recipient": [
    {
      layout: "send-recipient",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Send-recipient",
      catchClick: true,
      arrowPosition: ({ x, y, height, width }) => ({
        left: x + width / 2,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Send-amount": [
    {
      layout: "send-amount",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Send-amount",
      catchClick: true,
      arrowPosition: ({ x, y, height, width }) => ({
        left: x + width / 2,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Send-fees": [
    {
      layout: "send-fees",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Send-fees",
      catchClick: true,
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44 - 16,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Accounts-headerAddAccount": [
    {
      layout: "headerAddAccount",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Accounts-headerAddAccount",
      arrowPosition: ({ x, y, height, width }) => ({
        left: x + width / 2,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 25,
        textAlign: "right",
      }),
      cbPosition: "bottom",
    },
  ],
  "Receive-accountsList": [
    {
      layout: "receive-accountsList",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Receive-accountsList",
      arrowPosition: ({ x, y, height, width }) => ({
        left: x + width / 2,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Receive-verifyAddress": [
    {
      layout: "receive-shareAddress",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Receive-verifyAddress-shareAddress",
      catchClick: true,
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44 - 16,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
    {
      layout: "receive-addressDisclaimer",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Receive-verifyAddress-addressDisclaimer",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44 - 16 * 4,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "AddAccounts-currencyRow-addaccount-Bitcoin": [
    {
      layout: "currencyRow-addaccount-Bitcoin",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.AddAccounts-currencyRow-addaccount-Bitcoin",
      arrowPosition: ({ x, y, height, width }) => ({
        left: x + width / 2,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  selectDevice: [
    {
      layout: "selectDevice",
      arrow: require("../../images/producttour/arrow-topleft.png"),
      text: "producttour.overlay.selectDevice",
      arrowPosition: ({ x, y, height }) => ({
        left: x + 110,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "addAccount-accountsLists": [
    {
      layout: "addAccountAccountsLists",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.addAccount-addAccountAccountsLists",
      catchClick: true,
      arrowPosition: ({ x, y, height, width }) => ({
        left: x + width / 2,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Manager-managerDevice": [
    {
      layout: "managerDevice",
      arrow: require("../../images/producttour/arrow-topleft.png"),
      text: "producttour.overlay.Manager-managerDevice",
      arrowPosition: ({ x, y, height }) => ({
        left: x + 110,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
      catchClick: true,
    },
    {
      layout: "appsList",
      arrow: require("../../images/producttour/arrow-bottomright.png"),
      text: "producttour.overlay.Manager-appsList",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44 - 16,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
      catchClick: true,
    },
    {
      layout: "appRow-catalog-Bitcoin",
      arrow: require("../../images/producttour/arrow-bottomright.png"),
      text: "producttour.overlay.Manager-appRow-bitcoin",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44 - 16,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
};

const PortfolioOverlay = () => {
  const { colors, dark } = useTheme();
  const [disabled, setDisabled] = useState();
  const [index, setIndex] = useState(0);
  const ptContext = useContext(context);

  // console.log(ptContext);

  useEffect(() => {
    if (disabled === ptContext.holeConfig) {
      setIndex(0);
    }

    if (!ptContext.holeConfig || disabled !== ptContext.holeConfig) {
      setDisabled(null);
      setIndex(0);
    }
  }, [disabled, ptContext.holeConfig]);

  if (!ptContext.holeConfig || disabled === ptContext.holeConfig) {
    return null;
  }

  const configArray = configs[ptContext.holeConfig];

  const next = () => {
    if (configArray.length === index + 1) {
      setDisabled(ptContext.holeConfig);
    } else {
      setIndex(index + 1);
    }
  };

  const skip = () => {
    next();
    navigate(NavigatorName.ProductTour, {
      screen: ScreenName.ProductTourMenu,
    });
  };

  const config = configArray[index];

  // console.log(config, index);

  const layout = ptContext.layouts[config.layout];

  // not ready yet
  if (!layout) {
    return null;
  }

  // console.log(layout);

  const arrow = config.arrow;
  const arrowStyle = config.arrowPosition(layout);
  const textStyle = config.textLayout(layout);
  const text = config.text;
  const catchClick = config.catchClick;
  const disableSkip = config.disableSkip;

  return (
    <>
      <RNHoleView
        style={[
          styles.fullscreen,
          styles.holeView,
          {
            backgroundColor: dark ? colors.smoke : colors.darkBlue,
          },
        ]}
        holes={[
          {
            ...layout,
            borderRadius: 4,
          },
        ]}
        animation={{
          timingFunction: ERNHoleViewTimingFunction.EASE_IN_OUT,
          duration: 200,
        }}
      />
      <Image source={arrow} style={[arrowStyle, styles.tooltipArrow]} />
      <LText style={[textStyle, styles.tooltipText]} bold>
        <Trans i18nKey={text} />
      </LText>
      {catchClick ? (
        <TouchableOpacity style={[styles.fullscreen]} onPress={next} />
      ) : null}
      {!disableSkip ? (
        <TouchableOpacity
          style={[
            styles.closeButton,
            config.cbPosition === "bottom" ? styles.cbBottom : styles.cbTop,
          ]}
          onPress={skip}
        >
          <LText style={styles.closeText} bold>
            <Trans i18nKey="producttour.overlay.closeText" />
          </LText>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  holeView: { opacity: 0.9 },
  closeButton: {
    backgroundColor: "transparent",
    borderColor: "#FFF",
    borderWidth: 1,
    position: "absolute",
    right: 16,
    borderRadius: 4,
    zIndex: 10,
  },
  nextButton: {
    backgroundColor: "transparent",
    borderColor: "#FFF",
    borderWidth: 1,
    position: "absolute",
    left: 16,
    borderRadius: 4,
    zIndex: 10,
  },
  cbBottom: {
    bottom: 40,
  },
  cbTop: {
    top: 40,
  },
  closeText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#FFF",
    fontSize: 12,
  },
  tooltipArrow: {
    width: 16,
    height: 45,
    position: "absolute",
  },
  tooltipText: {
    fontSize: 16,
    position: "absolute",
    color: "#FFF",
  },
});

export default PortfolioOverlay;
