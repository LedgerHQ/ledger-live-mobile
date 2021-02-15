// @flow

import { useTheme } from "@react-navigation/native";
import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { RNHoleView } from "react-native-hole-view";
import { Trans } from "react-i18next";
import { context } from "./Provider";
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
  "Porfolio-TransferTab-Swap": [
    {
      layout: "TransferTab",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Porfolio-TransferTab-Swap",
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
  "Swap-accountFrom": [
    {
      layout: "swap-accountFrom",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Swap-accountFrom",
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
  "Swap-accountTo": [
    {
      layout: "swap-accountTo",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Swap-accountTo",
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
  "Swap-amount": [
    {
      layout: "swap-amount",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Swap-amount",
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
  "Porfolio-TransferTab-Buy": [
    {
      layout: "TransferTab",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Porfolio-TransferTab-Buy",
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
  "Buy-BuyCTA": [
    {
      layout: "buy-BuyCTA",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Buy-BuyCTA",
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
  "Buy-SelectBitcoinCurrency": [
    {
      layout: "currencyRow-exchange-Bitcoin",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Buy-SelectBitcoinCurrency",
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
  "Buy-SelectBitcoinAccount": [
    {
      layout: "Buy-SelectBitcoinAccount",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Buy-SelectBitcoinAccount",
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
  "Buy-coinify": [
    {
      layout: "coinify-widget",
      arrow: require("../../images/producttour/arrow-topright.png"),
      text: "producttour.overlay.Buy-coinify",
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
  const { colors } = useTheme();
  const [disabled, setDisabled] = useState();
  const [index, setIndex] = useState(0);
  const ptContext = useContext(context);

  // console.log(ptContext);

  useEffect(() => {
    if (disabled === ptContext.holeConfig) {
      setIndex(0);
    }

    if (!ptContext.holeConfig) {
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

  return (
    <>
      <RNHoleView
        style={[
          styles.fullscreen,
          { backgroundColor: colors.darkBlue, opacity: 0.9 },
        ]}
        holes={[
          {
            ...layout,
            borderRadius: 4,
          },
        ]}
      />
      <Image source={arrow} style={[arrowStyle, styles.tooltipArrow]} />
      <LText style={[textStyle, styles.tooltipText]} color="white" bold>
        <Trans i18nKey={text} />
      </LText>
      <TouchableOpacity
        /* android */
        onPress={e => {
          e.preventDefault();
          next();
        }}
        style={[styles.fullscreen, { backgroundColor: "transparent" }]}
      />
      <TouchableOpacity
        style={[
          styles.closeButton,
          config.cbPosition === "bottom" ? styles.cbBottom : styles.cbTop,
        ]}
        onPress={next}
      >
        <LText style={styles.closeText} color="white" bold>
          <Trans i18nKey="producttour.overlay.closeText" />
        </LText>
      </TouchableOpacity>
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
  },
  closeButton: {
    backgroundColor: "transparent",
    borderColor: "#FFF",
    borderWidth: 1,
    position: "absolute",
    right: 16,
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
    width: 8.5,
    height: 45,
    position: "absolute",
  },
  tooltipText: {
    fontSize: 16,
    position: "absolute",
  },
});

export default PortfolioOverlay;
