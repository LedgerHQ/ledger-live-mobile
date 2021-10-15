import React, { useCallback, useRef, useState, useEffect } from "react";
import { StyleSheet, FlatList, Text, Image, View } from "react-native";

type Props = {
  navigation: any,
  route: any
};

export default function SymbolDashboard({ route, navigation }: Props) {
  const { currencyOrToken } = route.params;
  const rsc = {
    icon: require("./bitcoin.png"),
    symbolName: "Bitcoin",
    symbolShort: "BTC",
    price: 448555.8,
    changePercent: 0.4434,
    activeCurrency: "USD"
  };
  const currencies= [
    {name: "BTC", symbol: "₿"},
    {name: "USD", symbol: "$"},
    {name: "EUR", symbol: "€"},
    {name: "CAD", symbol: "$"},
    {name: "INR", symbol: "₹"},
    {name: "GBP", symbol: "£"},
  ];
  return (
    <>
      <View style={styles.symbolHeader}>
        <Image
          style={styles.icon}
          source={rsc.icon}
        />
        <View flexDirection="column">
          <Text style={styles.symbolName}>
            {rsc.symbolName}
          </Text>
          <Text style={styles.symbolShort}>
            {rsc.symbolShort}
          </Text>
        </View>
      </View>
      <>
        <Text>
          Price
        </Text>
      </>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 64,
  },
  symbolName: {
    fontSize: 40,
  },
  symbolShort: {
    fontSize: 25
  },
  icon: {
    maxWidth: 50,
    maxHeight: 50
  },
  symbolHeader: {
    maxHeight: 50,
    flexDirection: "row"
  },
});
