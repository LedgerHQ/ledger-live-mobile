// @flow

import { Image, StyleSheet, View } from "react-native";
import React, { PureComponent } from "react";
import { RectButton } from "react-native-gesture-handler";
import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import Delta from "./Delta";

import LText from "./LText";
import { withTheme } from "../colors";

type Props = {
  currency: CryptoCurrency | TokenCurrency,
  onPress: (CryptoCurrency | TokenCurrency) => void,
  isOK?: boolean,
  style?: *,
  colors: *,
  range: string,
};

class CurrencyRow extends PureComponent<Props> {
  onPress = () => {
    this.props.onPress(this.props.currency);
  };

  render() {
    const { currency, range, style, isOK = true } = this.props;

    const priceChange = {
      percentage: currency.data
        ? currency.data["price_change_percentage_" + range + "_in_currency"] /
          100
        : 0,
    };

    return currency ? (
      <RectButton style={style} onPress={this.onPress}>
        <View style={styles.root}>
          <View flex={1}>
            <Image
              source={{ uri: currency.data.image }}
              style={styles.headerIcon}
            />
          </View>
          <View flex={4}>
            <View style={styles.flexRow}>
              <LText
                semiBold
                style={[styles.name]}
                numberOfLines={1}
                color={!isOK ? "fog" : "darkBlue"}
              >
                {currency.name}
              </LText>
              <LText semiBold style={[styles.ticker]} numberOfLines={1}>
                {"  "}{currency.ticker}
              </LText>
            </View>
            {currency.data && (
              <View style={styles.flexRow}>
                <LText style={[styles.rank]} semiBold>
                  {" "}{currency.data.market_cap_rank}{" "}
                </LText>
                <LText style={[styles.totalAsset]} semiBold>
                  {(currency.data.total_volume / 1000000000).toFixed(2)} Bn
                </LText>
              </View>
            )}
          </View>
          <View flex={3} />
          <View flex={4}>
            {currency.data && (
              <View style={styles.flexColumn}>
                <LText style={styles.price} semiBold>
                  $
                  {currency.data.current_price
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </LText>
                <View style={styles.delta}>
                  <Delta
                    percent
                    valueChange={priceChange}
                    style={styles.deltaPercent}
                    textStyle={styles.deltaPecentText}
                    toFixed={2}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </RectButton>
    ) : (
      null
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    width: "100%",
    borderBottomColor: '#14253310',
    borderBottomWidth: 1,
    borderRadius: 20
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    flexShrink: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  ticker: {
    fontSize: 12,
    color: "#14253360",
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
  right: {
    position: "absolute",
    flex: 1,
    flexDirection:"column",
    right: 10,
    borderWidth: 1
  },
  delta: {
    textAlign: "right",
    alignSelf: 'flex-end',
  },
  flexColumn: {
    flexDirection: "column",
  },
  rank: {
    backgroundColor: "#14253310",
    color: "#14253360",
    paddingHorizontal: 2,
    marginHorizontal: 9,
    fontSize: 12,
    borderRadius: 3
  },
  totalAsset: {
    color: "#14253360",
    fontSize: 12,
    alignSelf: "flex-end",
    textAlign: "right",
  },
  price: {
    textAlign: "right",
  },
  deltaPercent: {
    right: 0,
  },
  deltaPecentText: {
    fontSize: 12,
    textAlign: "right",
  },
  headerIcon: {
    width: 32,
    height: 32,
  },
});

export default withTheme(CurrencyRow);
