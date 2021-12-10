// @flow
import React, { useCallback } from "react";
import { StyleSheet, View, Linking } from "react-native";
import { Trans } from "react-i18next";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";

import IconPlus from "../../icons/Plus";
import Button from "../../components/Button";
import { NavigatorName, ScreenName } from "../../const";
import LText from "../../components/LText";
import { urls } from "../../config/urls";
import ExternalLink from "../../components/ExternalLink";
import { accountScreenSelector } from "../../reducers/accounts";

const ReceiveButton = ({ accountId }: { accountId: string }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const onReceiveClick = useCallback(() => {
    navigation.navigate(NavigatorName.SolanaOptInFlow, {
      screen: ScreenName.SolanaOptInSelectToken,
      params: { accountId },
    });
  }, [navigation, accountId]);
  return (
    <Button
      onPress={onReceiveClick}
      IconLeft={() => <IconPlus size={16} color={colors.live} />}
      title={<Trans i18nKey="account.tokens.addTokens" />}
      containerStyle={{ width: 120 }}
      type="lightSecondary"
      event="AccountReceiveSplToken"
      size={14}
    />
  );
};

const Placeholder = ({ accountId }: { accountId: string }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { account } = useSelector(
    accountScreenSelector({ params: { accountId } }),
  );
  const onReceiveClick = useCallback(() => {
    navigation.navigate(NavigatorName.SolanaOptInFlow, {
      screen: ScreenName.SolanaOptInSelectToken,
      params: { accountId },
    });
  }, [navigation, accountId]);
  const splTokensInfo = useCallback(() => {
    Linking.openURL(urls.supportLinkByTokenType.spl);
  }, []);

  const disabled = !account || account.balance.lte(0);

  return (
    <View style={[styles.placeholder, { borderColor: colors.fog }]}>
      <View style={styles.placeholderText}>
        <LText style={styles.description}>
          <Trans
            i18nKey={`account.tokens.solana.howTo`}
            values={{ currency: "solana" }}
          />
        </LText>
      </View>
      <View style={[styles.splTokensInfo, { borderColor: colors.live }]}>
        <ExternalLink
          event="SolanaSPLTokensInfo"
          onPress={splTokensInfo}
          text={<Trans i18nKey="account.tokens.solana.howSplTokensWork" />}
          ltextProps={{
            secondary: true,
            style: styles.splTokensInfoText,
          }}
        />
      </View>
      <Button
        event="AccountReceiveSplToken"
        type="primary"
        IconLeft={() => (
          <IconPlus size={16} color={disabled ? colors.grey : colors.live} />
        )}
        onPress={onReceiveClick}
        title={<Trans i18nKey="account.tokens.addTokens" />}
        disabled={disabled}
        containerStyle={styles.addTokenButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderStyle: "dashed",
    borderWidth: 1,

    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  description: { fontSize: 16 },
  placeholderText: {
    flex: 1,
    flexShrink: 1,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  splTokensInfo: {
    width: "100%",
    paddingVertical: 16,

    flexDirection: "row",
  },
  splTokensInfoText: {
    fontSize: 16,
    marginRight: 8,
  },
  addTokenButton: {
    width: "100%",
  },
});

export default {
  ReceiveButton,
  Placeholder,
};
