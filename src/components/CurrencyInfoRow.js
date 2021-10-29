// @flow

import { Image, StyleSheet, View } from "react-native";
import React, { PureComponent } from "react";
import { RectButton } from "react-native-gesture-handler";
import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import Delta from "../components/Delta";

import LText from "./LText";
import { withTheme } from "../colors";

type Props = {
  currency: CryptoCurrency | TokenCurrency,
  onPress: (CryptoCurrency | TokenCurrency) => void,
  isOK?: boolean,
  style?: *,
  colors: *,
  range: string
};

function magnitude(number) {
  // Convert to String
  const numberAsString = number.toString();
  // String Contains Decimal
  if (numberAsString.includes(".")) {
    return numberAsString.split(".")[1].length;
  }
  // String Does Not Contain Decimal
  return 0;
}

class CurrencyRow extends PureComponent<Props> {
  onPress = () => {
    this.props.onPress(this.props.currency);
  };

  render() {
    const { currency, range, style, isOK = true, colors } = this.props;

    const priceChange = {percentage: currency.data ? 
      currency.data["price_change_percentage_" + range + "_in_currency"] / 100 : 0
    }
    
    return currency ? (
      <RectButton style={[styles.root, style]} onPress={this.onPress}>
        <Image
          source={{ uri: currency.data.image }}
          style={styles.headerIcon}
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
          {currency.data && (
          <View style={styles.flexRow}>
            <LText style={[styles.rank]}>
              {currency.data.market_cap_rank}
            </LText>
            <LText style={[styles.totalAsset]}>
              {(currency.data.total_volume / 1000000000).toFixed(2)} Bn
            </LText>
          </View>)}
        </View>
        {currency.data && (
        <View style={styles.right}>
          <LText style={styles.price}>
            ${currency.data.current_price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </LText>
          <View>
            <Delta
              percent
              valueChange={priceChange}
              style={styles.deltaPercent}
              textStyle={styles.deltaPecentText}
              toFixed={2}
            />
          </View>
        </View>)}
      </RectButton>) : (<View></View>)
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
  },
  deltaPercent: {
    position: "absolute",
    right: 0
  },
  deltaPecentText: {
    fontSize: 12,
    textAlign: "right"
  },
  headerIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  }
});

export default withTheme(CurrencyRow);
