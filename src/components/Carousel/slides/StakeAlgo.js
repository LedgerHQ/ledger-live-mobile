// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { useNavigation } from "@react-navigation/native";
import { NavigatorName, ScreenName } from "../../../const";
import { accountsSelector } from "../../../reducers/accounts";
import getWindowDimensions from "../../../logic/getWindowDimensions";
import algorand from "../../../images/banners/algorand.png";
import LText from "../../LText";
import colors from "../../../colors";

const StakeAlgo = () => {
  const slideWidth = getWindowDimensions().width - 32;
  const navigation = useNavigation();
  const accounts = useSelector(accountsSelector);

  const onClick = useCallback(() => {
    const currency = getCryptoCurrencyById("algorand");
    const highestBalanceAccount = accounts
      .filter(a => a.currency === currency && a.balance.gt(0))
      .sort((a, b) => b.balance.minus(a.balance).toNumber());

    if (highestBalanceAccount[0]) {
      navigation.navigate(NavigatorName.AlgorandClaimRewardsFlow, {
        screen: ScreenName.AlgorandClaimRewardsStarted,
        params: { accountId: highestBalanceAccount[0].id },
      });
    } else {
      navigation.navigate(NavigatorName.AddAccounts, {
        currency,
      });
    }
  }, [accounts, navigation]);

  return (
    <TouchableOpacity onPress={onClick}>
      <View style={[styles.wrapper, { width: slideWidth }]}>
        <Image
          style={styles.illustration}
          source={algorand}
          width={126}
          height={100}
        />
        <View>
          <LText semiBold secondary style={styles.label}>
            <Trans i18nKey={`carousel.banners.algorand.title`} />
          </LText>
          <LText primary style={styles.description}>
            <Trans i18nKey={`carousel.banners.algorand.description`} />
          </LText>
        </View>
      </View>
    </TouchableOpacity>
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
    height: 100,
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
    color: colors.darkBlue,
    fontSize: 10,
    lineHeight: 15,
    marginRight: 100,
  },
  description: {
    color: colors.darkBlue,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 16,
    marginRight: 100,
  },
  layer: {
    position: "absolute",
  },
});

export default StakeAlgo;
