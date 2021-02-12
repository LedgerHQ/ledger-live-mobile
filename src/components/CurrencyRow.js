// @flow

import { StyleSheet, View } from "react-native";
import React, { PureComponent, useRef } from "react";
import { RectButton } from "react-native-gesture-handler";
import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";

import LText from "./LText";
import CircleCurrencyIcon from "./CircleCurrencyIcon";
import { withTheme } from "../colors";
import { reportLayout } from "../screens/ProductTour/Provider";

type Props = {
  currency: CryptoCurrency | TokenCurrency,
  onPress: (CryptoCurrency | TokenCurrency) => void,
  isOK?: boolean,
  style?: *,
  type?: string,
  colors: *,
};

const layoutReports = ["Bitcoin"];

const CurrencyRow = (props: Props) => {
  const { currency, style, isOK = true, colors } = props;
  const onPress = () => {
    props.onPress(props.currency);
  };
  const ref = useRef();
  return (
    <View
      ref={ref}
      onLayout={() => {
        if (!layoutReports.includes(currency.name)) {
          return;
        }
        reportLayout(
          ["currencyRow-" + (props.type || "") + "-" + currency.name],
          ref,
        );
      }}
    >
      <RectButton style={[styles.root, style]} onPress={onPress}>
        <CircleCurrencyIcon
          size={26}
          currency={currency}
          color={!isOK ? colors.lightFog : undefined}
        />
        <LText
          semiBold
          style={[styles.name]}
          numberOfLines={1}
          color={!isOK ? "fog" : "darkBlue"}
        >
          {`${currency.name} (${currency.ticker})`}
        </LText>
        {currency.type === "TokenCurrency" && currency.parentCurrency ? (
          <LText
            semiBold
            style={[styles.currencyLabel, { borderColor: colors.grey }]}
            color="grey"
          >
            {currency.parentCurrency.name}
          </LText>
        ) : null}
      </RectButton>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  name: {
    flexGrow: 1,
    flexShrink: 1,
    marginLeft: 10,
    fontSize: 14,
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
});

export default withTheme(CurrencyRow);
