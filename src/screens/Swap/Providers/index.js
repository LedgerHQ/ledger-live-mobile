// @flow

import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import SafeAreaView from "react-native-safe-area-view";

import Item from "./Item";
import Button from "../../../components/Button";
import LText from "../../../components/LText";

import IconChangelly from "../../../icons/swap/Changelly";
import IconParaswap from "../../../icons/swap/Paraswap";
import IconWyre from "../../../icons/swap/Wyre";

const Providers = ({
  setProvider,
  providers,
}: {
  setProvider: string => void,
  providers: { [string]: any },
}) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState();
  const availableProviders = providers.map(p => p.provider);
  const noCentralizedProviders = !availableProviders.length;

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.providerList}>
        <LText style={styles.title} semiBold secondary>
          <Trans i18nKey={"transfer.swap.providers.title"} />
        </LText>
        <Item
          id={"paraswap"}
          onSelect={setSelectedItem}
          selected={selectedItem}
          Icon={IconParaswap}
          title={t("transfer.swap.providers.paraswap.title")}
          bullets={[
            t("transfer.swap.providers.paraswap.bullet.0"),
            t("transfer.swap.providers.paraswap.bullet.1"),
            t("transfer.swap.providers.paraswap.bullet.2"),
          ]}
        />
        {noCentralizedProviders || availableProviders.includes("changelly") ? (
          <Item
            id={"changelly"}
            onSelect={setSelectedItem}
            selected={selectedItem}
            Icon={IconChangelly}
            title={t("transfer.swap.providers.changelly.title")}
            notAvailable={noCentralizedProviders}
            bullets={[
              t("transfer.swap.providers.changelly.bullet.0"),
              t("transfer.swap.providers.changelly.bullet.1"),
              t("transfer.swap.providers.changelly.bullet.2"),
            ]}
          />
        ) : availableProviders.includes("wyre") ? (
          <Item
            id={"wyre"}
            onSelect={setSelectedItem}
            selected={selectedItem}
            Icon={IconWyre}
            kyc
            title={t("transfer.swap.providers.wyre.title")}
            bullets={[
              t("transfer.swap.providers.wyre.bullet.0"),
              t("transfer.swap.providers.wyre.bullet.1"),
              t("transfer.swap.providers.wyre.bullet.2"),
            ]}
          />
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          type={"primary"}
          title={t("transfer.swap.providers.cta")}
          onPress={() => {
            selectedItem && setProvider(selectedItem);
          }}
          disabled={!selectedItem || selectedItem === "paraswap"}
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

export default Providers;
