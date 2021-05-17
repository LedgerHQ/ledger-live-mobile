// @flow

import React, { useState, useCallback } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import SafeAreaView from "react-native-safe-area-view";
import { useNavigation } from "@react-navigation/native";

import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";

import { ScreenName } from "../../const";
import Button from "../../components/Button";
import LText from "../../components/LText";
// import WyreIcon from "../../../icons/swap/Wyre";
import ChangellyIcon from "../../icons/swap/Changelly";
import WyreIcon from "../../icons/swap/Wyre";

import Item from "./ProviderListItem";
import manifests from "./manifests";

type RouteParams = {
  defaultAccount: ?AccountLike,
  defaultParentAccount: ?Account,
};

const ExchangeProviders = ({ route }: { route: { params: RouteParams } }) => {
  const { params: routeParams } = route;
  const [selectedItem, setSelectedItem] = useState();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const rows = false;

  const onContinue = useCallback(
    (provider: string) => {
      // TODO: may need something more robust against unknown/unsupported providers
      switch (provider) {
        case "coinify":
          navigation.navigate(ScreenName.Exchange, routeParams);
          break;
        default: {
          const manifest = manifests[provider];
          navigation.navigate(ScreenName.ExchangeDapp, { manifest });
          break;
        }
      }
    },
    [routeParams, navigation],
  );

  // TODO: auto-generate by parsing all manifests

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.providerList}>
        <LText style={styles.title} semiBold secondary>
          <Trans i18nKey={"transfer.exchange.providers.title"} />
        </LText>
        {__DEV__ && (
          <Item
            rows={rows}
            id={"debug"}
            onSelect={setSelectedItem}
            selected={selectedItem}
            title={"Debug"}
            bullets={["test app"]}
          />
        )}
        <Item
          rows={rows}
          id={"wyre"}
          onSelect={setSelectedItem}
          selected={selectedItem}
          Icon={WyreIcon}
          title={t("transfer.exchange.providers.wyre.title")}
          bullets={[
            t("transfer.exchange.providers.wyre.bullet.0"),
            t("transfer.exchange.providers.wyre.bullet.1"),
            t("transfer.exchange.providers.wyre.bullet.2"),
            t("transfer.exchange.providers.wyre.bullet.3"),
          ]}
        />
        <Item
          rows={rows}
          id={"coinify"}
          onSelect={setSelectedItem}
          selected={selectedItem}
          Icon={ChangellyIcon}
          title={t("transfer.exchange.providers.coinify.title")}
          bullets={[
            t("transfer.exchange.providers.coinify.bullet.0"),
            t("transfer.exchange.providers.coinify.bullet.1"),
            t("transfer.exchange.providers.coinify.bullet.2"),
            t("transfer.exchange.providers.coinify.bullet.3"),
          ]}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          type={"primary"}
          title={t("transfer.exchange.providers.cta")}
          onPress={() => {
            selectedItem && onContinue(selectedItem);
          }}
          disabled={!selectedItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    textAlign: "center",
    marginVertical: 24,
  },
  providerList: {
    paddingHorizontal: 16,
  },
  footer: {
    padding: 16,
  },
});

export default ExchangeProviders;
