// @flow

import { StyleSheet, View } from "react-native";
import React, { PureComponent } from "react";
import { RectButton } from "react-native-gesture-handler";
import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";

import LText from "./LText";
import CircleCurrencyIcon from "./CircleCurrencyIcon";
import { withTheme } from "../colors";

type Props = {
  currency: CryptoCurrency | TokenCurrency,
  onPress: (CryptoCurrency | TokenCurrency) => void,
  isOK?: boolean,
  style?: *,
  colors: *,
};

class CurrencyRow extends PureComponent<Props> {
  onPress = () => {
    this.props.onPress(this.props.currency);
  };

  render() {
    const { currency, style, isOK = true, colors } = this.props;

    return (
      <RectButton style={[styles.root, style]} onPress={this.onPress}>
        <CircleCurrencyIcon
          size={26}
          currency={currency}
          color={!isOK ? colors.lightFog : undefined}
        />
        <View style={styles.left}>
          <View style={styles.flexRow}>
            <LText
              semiBold
              style={[styles.name]}
              numberOfLines={1}
              color={!isOK ? "fog" : "darkBlue"}
            >
            {currency.name}
            </LText>
            <LText
              semiBold
              style={[styles.ticker]}
              numberOfLines={1}
            >
            · {currency.ticker}
            </LText>
          </View>
          <View style={styles.flexRow}>
            <LText style={[styles.rank]}>
              {currency.rank}
            </LText>
            <LText style={[styles.totalAsset]}>
              {(currency.totalAsset / 1000000000).toFixed(2)} Bn
            </LText>
          </View>
        </View>
        <View style={styles.right}>
          <LText style={styles.price}>
            ${currency.price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </LText>
          {currency.changePercent > 0 ? (
            <LText style={styles.changePercentUp}>
              ↗ {(currency.changePercent * 100).toFixed(2)}%
            </LText>
          ) : (
            <LText style={styles.changePercentDown}>
              ↘ {(Math.abs(currency.changePercent) * 100).toFixed(2)}%
            </LText>
          )}
        </View>
      </RectButton>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    width: "100%"
  },
  flexRow: {
    flexDirection: "row"
  },
  name: {
    flexShrink: 1,
    marginLeft: 10,
    fontSize: 14
  },
  ticker: {
    fontSize: 12,
    color: "#14253350"
  },
  currencyLabel: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    textAlign: "right",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 6,
    fontSize: 10,
    height: 24,
    lineHeight: 24,
    marginLeft: 12,
  },
  left: {
    left: 0
  },
  right: {
    position: "absolute",
    right: 10
  },
  rank: {
    backgroundColor: "#14253310",
    color: "#14253350",
    paddingHorizontal: 3,
    marginHorizontal: 9,
    fontSize: 12
  },
  totalAsset: {
    color: "#14253350",
    fontSize: 12,
    alignSelf: "flex-end",
    textAlign: "right"
  },
  changePercentUp: {
    color: "#6EC85C",
    alignSelf: "flex-end",
    textAlign: "right"
  },
  changePercentDown: {
    color: "#F04F52",
    alignSelf: "flex-end",
    textAlign: "right"
  },
  price: {
    alignSelf: "flex-end",
    textAlign: "right"
  }
});

export default withTheme(CurrencyRow);
