/* @flow */
import React from "react";
import { Trans } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import colors from "../../colors";
import { NavigatorName } from "../../const";
import LText from "../../components/LText";
import Button from "../../components/Button";
import IconReceive from "../../icons/Receive";
import PortfolioNoOpIllustration from "../../icons/PortfolioNoOpIllustration";

export default function NoOpStatePortfolio() {
  const route = useRoute();
  const { navigate } = useNavigation();

  function navigateToReceive() {
    navigate(NavigatorName.ReceiveFunds, {
      params: {
        goBackKey: route.key,
      },
      key: "receivefunds",
    });
  }

  return (
    <View style={styles.root}>
      <View style={styles.body}>
        <PortfolioNoOpIllustration />
        <LText secondary semiBold style={styles.title}>
          {<Trans i18nKey="portfolio.noOpState.title" />}
        </LText>
        <LText style={styles.desc}>
          {<Trans i18nKey="portfolio.noOpState.desc" />}
        </LText>
        <Button
          event="PortfolioNoOpToReceive"
          type="primary"
          IconLeft={IconReceive}
          onPress={navigateToReceive}
          title={<Trans i18nKey="account.receive" />}
          containerStyle={styles.buttonFull}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    margin: 16,
    alignSelf: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    alignItems: "center",
  },
  buttonFull: {
    alignSelf: "stretch",
  },
  title: {
    marginTop: 32,
    marginBottom: 16,
    fontSize: 16,
  },
  desc: {
    fontSize: 14,
    lineHeight: 21,
    marginHorizontal: 18,
    color: colors.grey,
    textAlign: "center",
    marginBottom: 32,
  },
});
