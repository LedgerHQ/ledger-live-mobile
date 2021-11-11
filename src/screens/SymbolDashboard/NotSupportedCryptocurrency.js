import React, { useCallback } from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5Pro";
import { normalize } from "../../helpers/normalizeSize";

export default function NotSupportedCryptocurrency() {
  const onLearnMore = useCallback(() => {
    Linking.openURL("https://www.ledger.com/supported-crypto-assets");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Icon size={16} color={"#6490F1"} name={"info-circle"} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>
          {"Binance Coin is not supported on Ledger Live."}
          <Text onPress={onLearnMore} style={[styles.text, styles.btnText]}>
            Learn more
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "rgba(100, 144, 241, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 16,
    height: 16,
    marginRight: 16,
  },
  textWrapper: {
    flexDirection: "row",
    flex: 1,
  },
  text: {
    color: "#6490F1",
    fontSize: normalize(13),
    lineHeight: normalize(18),
    fontWeight: "500",
  },
  btnText: {
    fontWeight: "600",
  },
});
